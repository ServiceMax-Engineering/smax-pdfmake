const fs = require("fs");

let fontsPath = "fonts";
if (process.argv.length > 2) {
	fontsPath = process.argv[2];
}

const fonts = {
	OpenSans: {
		normal: `${fontsPath}/OpenSans.ttf`,
		bold: `${fontsPath}/OpenSans-Bold.ttf`,
		italics: `${fontsPath}/OpenSans-Italic.ttf`,
		bolditalics: `${fontsPath}/OpenSans-BoldItalic.ttf`,
	},
	Roboto: {
		normal: `${fontsPath}/Roboto-Regular.ttf`,
		bold: `${fontsPath}/Roboto-Medium.ttf`,
		italics: `${fontsPath}/Roboto-Italic.ttf`,
		bolditalics: `${fontsPath}/Roboto-MediumItalic.ttf`,
	},
	NotoSansHebrew: {
		normal: `${fontsPath}/NotoSansHebrew-Regular.ttf`,
		bold: `${fontsPath}/NotoSansHebrew-Bold.ttf`,
	},
	NotoSansArabic: {
		normal: `${fontsPath}/NotoSansArabic-Regular.ttf`,
		bold: `${fontsPath}/NotoSansArabic-Medium.ttf`,
	},
	Rubik: {
		normal: `${fontsPath}/Rubik-Regular.ttf`,
		bold: `${fontsPath}/Rubik-Bold.ttf`,
		italics: `${fontsPath}/Rubik-Italic.ttf`,
		bolditalics: `${fontsPath}/Rubik-BoldItalic.ttf`,
	},
	IBMPlexSansArabic: {
		normal: `${fontsPath}/IBMPlexSansArabic-Regular.ttf`,
		bold: `${fontsPath}/IBMPlexSansArabic-Bold.ttf`,
		italics: `${fontsPath}/IBMPlexSansArabic-Regular.ttf`,
		bolditalics: `${fontsPath}/IBMPlexSansArabic-Bold.ttf`,
	},
};

const PdfPrinter = require("../src/printer");
const printer = new PdfPrinter(fonts);

var docDefinition = {
	content: [
		'First paragraph',
		'Another paragraph, this time a little bit longer to make sure, this line will be divided into at least two lines'
	]
};

const pdfDoc = printer.createPdfKitDocument(docDefinition);
pdfDoc.pipe(fs.createWriteStream(`${fontsPath}/../pdfs/basics.pdf`));
pdfDoc.end();