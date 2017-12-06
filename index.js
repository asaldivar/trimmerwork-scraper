const express = require('express')
const app = express()
const crypto = require('crypto')

/************ x-ray ***************/
// const Xray = require('x-ray')
// const x = Xray({
//   filters: {
//     trim: function(value) {
//       return value.replace(/\r?\n/g, '').trim()
//     },
//     findJobType: function(value) {
// 			return value.substring(value.lastIndexOf("Job Type:")+10,value.length)
//     },
//     date: function(value) {
//     	console.log('value:',value.substring(0, value.indexOf('-')))
//     	return value.substring(0, value.indexOf('-'))
//     }
//   }
// })

// x('https://www.indeed.com/jobs?q=cannabis&l=Portland%2C+OR&sort=date', '[data-tn-component="organicJob"]', [{
//   details: x('.turnstileLink@href', {
//   	_id: 'link[rel="alternate"]@href',
// 		companyName: 'span.company',
//   	jobTitle: '.jobtitle',
//   	jobType: '.summary p:contains("Job Type")| findJobType',
//   	jobLocation: 'span.location',
//   	date: 'meta[name="description"]@content',
// 		jobCompensation: '[data-tn-component="jobHeader"] div:last-child | trim',
// 		jobDescription: '.summary@html',
//   	jobApplication: '[rel="canonical"]@href'
//   })
// }])
//   .paginate('.pagination a:last-child@href')
//   .limit(10)
//   .write('results.json')
/**********************************/
/************ x-ray ***************/
const Xray = require('x-ray')
const x = Xray({
	filters: {
		trim: function(value) {
			return value.replace(/\r?\n/g, '').trim()
		},
		replaceNwithBr: function(value) {
			return value.replace(/ /g,'')
		}
	}
})

x('https://420jobsearch.com/browse-jobs', '.job-list li', [{
	city: '.loc_city',
	state: '.loc_state',
	date: '.job-footer span:last-child',
	jobApplication: 'a@href',
	details: x('a@href', {
		companyName: '.content .inverse-link',
		jobTitle: '.addthis_inline_share_toolbox@data-title',
		jobType: '.job-type | trim',
		jobDescription: '.container .eleven .padding-right@html',
		// jobCompensation: '.job-overview li:first-child div a | trim',
	})
}]).paginate('.next@href').limit(17)(function(err, value) {
	var testObject = value

	let newArray = []

	testObject.map(obj => {
		let newObject = {}
		const currentDate = (new Date()).valueOf().toString()
		const random = Math.random().toString()

		obj.details.jobLocation = obj.city + ', ' + obj.state
		obj.details._id = crypto.createHash('sha1').update(currentDate + random).digest('hex')
		obj.details.date = !isNaN(obj.date.charAt(1)) ? Date.now() : obj.date
		obj.details.jobApplication = obj.jobApplication
		obj.details.jobDescription = obj.details.jobDescription.slice(obj.details.jobDescription.indexOf('<p class="job-full-descr">'), obj.details.jobDescription.lastIndexOf('How to apply'))

		console.log(JSON.stringify(obj.details))
	})

})
/**********************************/


app.get('/', (req, res) => res.json({ message: 'scrape on'}))

app.listen(7000, () => console.log('App listening on port 7000'))