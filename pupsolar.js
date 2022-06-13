"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_extra_1 = __importDefault(require("puppeteer-extra"));
const puppeteer_extra_plugin_stealth_1 = __importDefault(require("puppeteer-extra-plugin-stealth"));
const fs = require('fs');
const login = 'aigibson';
const pw = fs.readFileSync('./password.txt', 'utf-8');
const solarPIN = 772604;
async function run() {
    const browser = await puppeteer_extra_1.default.use((0, puppeteer_extra_plugin_stealth_1.default)()).launch({
        headless: true,
        defaultViewport: null,
        args: ['--remote-debugging-port=9222', '--remote-debugging-address=0.0.0.0'],
    });
    const [page] = await browser.pages();
    await page.setDefaultNavigationTimeout(600000);
    await page.goto('https://solar.reed.edu');
    await page.type('[id="username"]', login);
    await page.type('[id="password"]', pw);
    await page.click(`button[name="_eventId_proceed"]`);
    //TODO duo happens here, must click phone notif
    //TODO this is just components, I have to make it all a logical progression still
    {
        //Solar PIN login
        const element = await page.waitForSelector(`input[id='login_pin']`);
        await (element === null || element === void 0 ? void 0 : element.type(solarPIN.toString()));
        await page.click(`input[value="Log in"]`);
    }
    {
        //X out the "You're In!" popup that blocks the "Add Courses" button
        await page.click(`div.alert-dismissible > button`);
    }
    {
        //click "Add Courses" Button from home screen
        const element = await page.waitForSelector(`a[id='scheduler-actions-courses']`);
        await (element === null || element === void 0 ? void 0 : element.click());
    }
    {
        //swap semester selection from home screen
        await page.click(`button[id="term-links-btn"]`);
        await page.click(`a.dropdown-item:not(a.active)`);
    }
    {
        //finalize choices from home screen
        const element = await page.waitForSelector(`a[id='scheduler-actions-finalize']`);
        await (element === null || element === void 0 ? void 0 : element.click());
    }
    {
        //select subject in search
        //all subject codes listed in readme
        let subject = 'AMER';
        await page.select('select[id="search_subject_code"]', subject);
        let courseNum = 101;
        const element = await page.waitForSelector(`input[id="search_course_number"]`);
        await (element === null || element === void 0 ? void 0 : element.type(courseNum.toString()));
        await page.click(`input[value="Show results"]`);
    }
    {
        //todo should i b using waitForSelector in front of everything? what happens when selector doesn't exist? this program must b robust
        //todo check if mult pages boolean, can't have this shit crashing
        await page.click(`a.next_page`); //only present if there ARE mult pages
        await page.click(`a.previous_page`); //only present if on pg2 or higher
    }
    {
        //click "Add" on course. also works for waitlisting
        let CRN = 10021;
        const element = await page.waitForSelector(`div#search_${CRN} > div.course-header > div.course-actions > a`);
        await (element === null || element === void 0 ? void 0 : element.click());
        //check if success
    }
}
run();
