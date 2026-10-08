import test from 'node:test';
import assert from 'node:assert/strict';
import {bodyText} from './check-docs.mjs';
test('HTML body comparison ignores presentation but catches changed visible words',()=>{
 const a='<html><head><title>ignored</title></head><body><h1>가이드</h1><p>A &amp; B</p></body></html>';
 assert.equal(bodyText(a),bodyText('<body><div>가이드</div> A &#38; B</body>'));
 assert.notEqual(bodyText(a),bodyText('<body>가이드 A &amp; C</body>'));
 assert.throws(()=>bodyText('<head>not a document</head>'));
});
