/*global QUnit*/

sap.ui.define([
	"schedule-anu/controller/Schedule.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Schedule Controller");

	QUnit.test("I should test the Schedule controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
