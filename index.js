const express = require('express')
const app = express()

/************ x-ray ***************/
const Xray = require('x-ray')
const x = Xray({
  filters: {
    clean: function (value){
      return value.replace(/\r?\n/g, '').trim()
    }
  }
})

x('https://www.indeed.com/q-cannabis-jobs.html', '[data-tn-component="organicJob"]', [{
  details: x('.turnstileLink@href', {
		companyName: 'span.company',
  	jobTitle: '.jobtitle',
  	jobLocation: 'span.location',
		jobCompensation: '[data-tn-component="jobHeader"] div:last-child | clean',
		jobDescription: '.summary@html',
  	jobApplication: '[rel="canonical"]@href'
  })
}])
  .paginate('.pagination a:last-child@href')
  .limit(2)
  .write('results.json')
/**********************************/

app.get('/', (req, res) => res.json({ message: 'scrape on'}))

app.listen(7000, () => console.log('App listening on port 7000'))