'use strict';

var assert = require('assert');
var SVGMeasure = require('../src/svgMeasure');

// NOTE: more tests for SVGMeasure in integration/svgs.js

var inputBasic =
    '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n' +
    '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n' +
    '<svg width="105pt" height="222pt" viewBox="0.00 0.00 105.43 222.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n' +
    '    <rect width="105" height="222" fill="none" stroke="black"/>\n' +
    '</svg>\n';

var inputWithNewline =
    '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n' +
    '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n' +
    '<svg width="105pt" height="222pt" viewBox="0.00 0.00 105.43 222.00" xmlns="http://www.w3.org/2000/svg"\n' +
    '    xmlns:xlink="http://www.w3.org/1999/xlink">\n' +
    '    <rect width="105" height="222" fill="none" stroke="black"/>\n' +
    '</svg>\n';

var inputWithComment1 =
    '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n' +
    '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n' +
    '<!-- <svg -->\n' +
    '<svg width="105pt" height="222pt" viewBox="0.00 0.00 105.43 222.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n' +
    '    <rect width="105" height="222" fill="none" stroke="black"/>\n' +
    '</svg>\n';

var inputWithComment2 =
    '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n' +
    '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n' +
    '<!-- <svg width="123" height="456"> -->\n' +
    '<svg width="105pt" height="222pt" viewBox="0.00 0.00 105.43 222.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n' +
    '    <rect width="105" height="222" fill="none" stroke="black"/>\n' +
    '</svg>\n';


describe('SVGMeasure', function () {

    var svgMeasure = new SVGMeasure();

    it('gracefully handles empty input', function () {
        var dimensions = svgMeasure.measureSVG('');

        assert.equal(typeof dimensions, 'object');
    });

    it('gracefully handles gibberish input', function () {
        var dimensions = svgMeasure.measureSVG('wakka wakka wakka');

        assert.equal(typeof dimensions, 'object');
    });

    it('identifies the svg tag (1)', function () {
        var tag = svgMeasure.getSVGNode(inputBasic);

        assert.equal(tag, '<svg width="105pt" height="222pt" viewBox="0.00 0.00 105.43 222.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">');
    });

    it('identifies the svg tag (2)', function () {
        var tag = svgMeasure.getSVGNode(inputWithComment2);

        assert.equal(tag, '<svg width="105pt" height="222pt" viewBox="0.00 0.00 105.43 222.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">');
    });

    it('identifies the svg tag (3)', function () {
        var tag = svgMeasure.getSVGNode(inputWithNewline);

        assert.equal(tag, '<svg width="105pt" height="222pt" viewBox="0.00 0.00 105.43 222.00" xmlns="http://www.w3.org/2000/svg"\n    xmlns:xlink="http://www.w3.org/1999/xlink">');
    });

    it('returns correct dimensions for pts', function () {
        var dimensions = svgMeasure.measureSVG(inputBasic);

        assert.equal(typeof dimensions, 'object');
        assert.equal(typeof dimensions.width, 'number');
        assert.equal(typeof dimensions.height, 'number');

        assert.equal(dimensions.width, 105);
        assert.equal(dimensions.height, 222);
    });

    it('correctly handles multi-line svg tags', function () {
        var dimensions = svgMeasure.measureSVG(inputWithNewline);

        assert.equal(typeof dimensions, 'object');
        assert.equal(typeof dimensions.width, 'number');
        assert.equal(typeof dimensions.height, 'number');

        assert.equal(dimensions.width, 105);
        assert.equal(dimensions.height, 222);
    });

    it('ignores "svg tags" in comments (1)', function () {
        var dimensions = svgMeasure.measureSVG(inputWithComment1);

        assert.equal(typeof dimensions, 'object');
        assert.equal(typeof dimensions.width, 'number');
        assert.equal(typeof dimensions.height, 'number');

        assert.equal(dimensions.width, 105);
        assert.equal(dimensions.height, 222);
    });

    it('ignores "svg tags" in comments (2)', function () {
        var dimensions = svgMeasure.measureSVG(inputWithComment2);

        assert.equal(typeof dimensions, 'object');
        assert.equal(typeof dimensions.width, 'number');
        assert.equal(typeof dimensions.height, 'number');

        assert.equal(dimensions.width, 105);
        assert.equal(dimensions.height, 222);
    });
})