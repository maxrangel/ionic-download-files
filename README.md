# Ionic 5 File download/open example app

## Table of contents
* [General Info](#general-info)
* [Technologies](#technologies)
* [Launch](#launch)

## General Info
#### This is a simple application made with Ionic 5 to provide an example on how to create/download and open files from the web and on an Android device, for now, this app shows how to do these task on PDF and Excel files.

## Technologies
#### a) Ionic 5

#### b) Capacitor: For using the Filesystem plugin to create the files and directories on the mobile device (Android).

#### c) XLSX (v. 0.15.6): To create Excel files, link to their repo:
#### https://github.com/SheetJS/sheetjs

#### d) pdfmake-wrapper (v. 2.0.0): To create PDF files, it is build up on PDF Maker, link to their repo:
#### https://github.com/Lugriz/pdfmake-wrapper

## Launch

#### To run this project after downloading it on your machine, you need to install the dependencies of the project, run on your terminal at the root of the project: `npm i`

#### Then, to run the project on the web, run: `ionic serve`

#### To be able to run this app on a mobile device, make sure to run: `ionic build`

#### If you want to run it on an Android device, run: `ionic cap run android -l --host:0.0.0.0`
