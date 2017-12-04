const express = require('express')
const app = express()

/************ x-ray ***************/
const Xray = require('x-ray')
const x = Xray({
  filters: {
    trim: function(value) {
      return value.replace(/\r?\n/g, '').trim()
    },
    findJobType: function(value) {
			return value.substring(value.lastIndexOf("Job Type:")+10,value.length)
    },
    date: function(value) {
    	console.log('value:',value.substring(0, value.indexOf('-')))
    	return value.substring(0, value.indexOf('-'))
    }
  }
})

x('https://www.indeed.com/jobs?q=cannabis&l=Portland%2C+OR&sort=date', '[data-tn-component="organicJob"]', [{
  details: x('.turnstileLink@href', {
  	_id: 'link[rel="alternate"]@href',
		companyName: 'span.company',
  	jobTitle: '.jobtitle',
  	jobType: '.summary p:contains("Job Type")| findJobType',
  	jobLocation: 'span.location',
  	date: 'meta[name="description"]@content',
		jobCompensation: '[data-tn-component="jobHeader"] div:last-child | trim',
		jobDescription: '.summary@html',
  	jobApplication: '[rel="canonical"]@href'
  })
}])
  .paginate('.pagination a:last-child@href')
  .limit(10)
  .write('results.json')
/**********************************/

// var testObject = []

// let newArray = []

// var foo = testObject.map(obj => {
// 	let newObject = {}
// 	return JSON.stringify(obj.details)
// })

app.get('/', (req, res) => res.json({ message: 'scrape on'}))

app.listen(7000, () => console.log('App listening on port 7000'))