const request = require('request')
const stream = require('stream')
const fs = require('fs-extra')
var Curl = require( 'node-libcurl' ).Curl

const rp = require('request-promise')

const fetch = require('node-fetch')

var curl = new Curl()


const outStream1 = new stream.PassThrough()
const outStream2 = new stream.PassThrough()
const outStream3 = new stream.PassThrough()
const outStream4 = new stream.PassThrough()
const outStream5 = new stream.PassThrough()

const testuri = 'http://aiweb.cs.washington.edu/research/projects/xmltk/xmldata/data/tpc-h/customer.xml'

function getdata1(){

	return new Promise((resolve, reject) => {

		curl.setOpt(Curl.option.URL, testuri)
		curl.setOpt('FOLLOWLOCATION', true)

		outStream1.on('finish', function(){
			console.log('finish 1')
			resolve()
		});

		curl.on('end', function(statusCode, body, headers) {
			outStream1.write(body)
			outStream1.end()
			this.close()
		})
		curl.perform()
	})

}

function getdata2(){

	return new Promise((resolve, reject) => {

		outStream2.on('finish', () => {
			console.log('finish 2')
			resolve()
		})

		request.get(testuri).pipe(outStream2)

	})

}

function getdata3(){

	return new Promise((resolve, reject) => {

		outStream3.on('finish', function(){
			console.log('finish 3')
			resolve()
		})

		rp(testuri)
		.then(function (body) {
			outStream3.write(body)
			outStream3.end()
		})

	})

}

function getdata4(){

	return new Promise((resolve, reject) => {

		outStream4.on('finish', function(){
			console.log('finish 4')
			resolve()
		})

		outStream4.on('error', (err) => {
			console.log('2', err)
		})

		fetch(testuri)
		.then(res => {
			res.body.pipe(outStream4)
		})

	})
}

function getdata5(){

	return new Promise((resolve, reject) => {

		outStream5.on('finish', function(){
			console.log('finish 5')
			resolve()
		})

		request.get(testuri)
		.on('response', (resp) => {
			resp.on('data', (data) => {
				outStream5.write(data)
			})
			resp.on('end', () => {
				outStream5.end()
				resolve()
			})

		}).on('error', (err) => {
			console.log('1', err)
		});

	})
}





getdata5().then(function() {
	const wstream5 = fs.createWriteStream('test5.xml')
	outStream5.pipe(wstream5)
})







/*

getdata1().then(function() {
	const wstream1 = fs.createWriteStream('test1.xml')
	outStream1.pipe(wstream1)
})

getdata3().then(function() {
	const wstream3 = fs.createWriteStream('test3.xml')
	outStream3.pipe(wstream3)
})

getdata2().then(function() {
	const wstream2 = fs.createWriteStream('test2.xml')
	outStream2.pipe(wstream2)
})


getdata4().then(function() {
	const wstream4 = fs.createWriteStream('test4.xml')
	outStream4.pipe(wstream4)
})

getdata5().then(function() {
	const wstream5 = fs.createWriteStream('test5.xml')
	outStream5.pipe(wstream5)
}) */