import * as FileSaver from 'file-saver';
import { Component } from '@angular/core';
import { Platform, LoadingController } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { PdfMakeWrapper } from 'pdfmake-wrapper';
import { Plugins, FilesystemDirectory } from '@capacitor/core';
const { Filesystem } = Plugins;
import pdfFonts from 'pdfmake/build/vfs_fonts'; // fonts provided for pdfmake
import * as XLSX from 'xlsx';

// Set the fonts to use
PdfMakeWrapper.setFonts(pdfFonts);

const FILES_MIME_TYPES = {
  EXCEL_TYPE:
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
  PDF_TYPE: 'application/pdf',
};

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(
    private platform: Platform,
    private file: File,
    private fileOpener: FileOpener,
    private loadingCtrl: LoadingController
  ) {}

  s2ab(stream) {
    let buf = new ArrayBuffer(stream.length); //convert s to arrayBuffer
    let view = new Uint8Array(buf); //create uint8array as viewer
    for (let i = 0; i < stream.length; i++)
      view[i] = stream.charCodeAt(i) & 0xff; //convert to octet
    return buf;
  }

  async saveFileOnDevice(
    fileName: string,
    fileType: 'excel' | 'pdf',
    base64Data: string
  ) {
    const fileMimeType =
      fileType === 'excel'
        ? FILES_MIME_TYPES.EXCEL_TYPE
        : FILES_MIME_TYPES.PDF_TYPE;
    try {
      await Filesystem.writeFile({
        path: `/MEM-warehouse/${fileName}`,
        data: base64Data,
        directory: FilesystemDirectory.Documents,
      });

      const filePath = await Filesystem.getUri({
        directory: FilesystemDirectory.Documents,
        path: `/MEM-warehouse/${fileName}`,
      });

      await this.fileOpener
        .showOpenWithDialog(filePath.uri, fileMimeType)
        .then(() => console.log('File is opened'))
        .catch(e => console.log('Error opening file', e));
    } catch (err) {
      console.log(err);
    }
  }

  async onCreateExcel() {
    const loading = await this.loadingCtrl.create({
      message: 'Creating excel file... ',
    });
    await loading.present();

    // Creating workbook
    const workbook = XLSX.utils.book_new();

    workbook.SheetNames.push('Test sheet');

    // Excel data must be an array of arrays, each array represents a row and each element inside that
    // array represents a cell, here it would take the first row and occupy the first 5 cells with the 
    // data we provide. 
    const excelData = [['this', 'is', 'a', 'test']];
    const worksheet = XLSX.utils.aoa_to_sheet(excelData);
    
    workbook.Sheets['Test sheet'] = worksheet;

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: !this.platform.is('android') ? 'binary' : 'base64',
    });

    if (this.platform.is('android')) {
      this.saveFileOnDevice('test.xlsx', 'excel', excelBuffer);
    } else {
      // Save on desktop
      FileSaver.saveAs(
        new Blob([this.s2ab(excelBuffer)], {
          type: 'application/octet-stream',
        }),
        'test.xlsx'
      );
    }

    await loading.dismiss();
  }

  async onCreatePdf() {
    const loading = await this.loadingCtrl.create({
      message: 'Creating PDF file... ',
    });
    await loading.present();

    const pdf = new PdfMakeWrapper();
    pdf.add('Hello world!');

    if (this.platform.is('android')) {
      console.log('download pdf on device');

      await pdf.create().getBase64(async pdfBase64 => {
        this.saveFileOnDevice('test.pdf', 'pdf', pdfBase64);
      });
    } else {
      // Just download on Desktop device (browser)
      pdf.create().download();
    }

    await loading.dismiss();
  }
}
