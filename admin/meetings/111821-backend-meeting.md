# 111821 meeting notes

## Backend Meeting

## Attendance: Mihir, Luke

## Notes:

- First goal: wrap around functionality of spoonacular
	- providing data to UI team in json format - they will fill in the cards
- Second goal: store a preset query (ingredients to include/exclude, maybe one or two other options)
- Third goal: create proxy to hide API key
	- use github secrets
	- API service gateway (potentially php)
	- rest api to hit GitHub secrets

- Workflow
	- user enters page
	- page will preinitialize using stored settings
	- user will send list of ingredients
	- fetch using ingredients
	- TO DECIDE: whether we provide entire json or we only strip for necessary parts 
		- we can use the helper functions provided (cite the usage)
	- user sees recipes, selects one
	- fetch that specific recipe, return the json for that
		- again TBD how much we strip out from the json

- Immediate goals
	- implement the workflow as a sequence of callable functions on backend
		- assigned to Luke
		- potential functionality:
		- given some ingredient, populate a local object with the ingredient
		- separate function that will take object, split into tokens for query, and then send the query (and return something)
		- plan to add local storage preset in the next few days (doesn't need to happen yet)
		- Mihir's job: look at if we should clean up the result for UI or if they can just extract data themselves
	- look at how to implement the local storage system
		- implement function to add to presets
		- implement function to remove from presets
		- clear all?
		- assigned to Mihir
	- look into the proxy system
		- both of us will take a look at what this requires
		- reconvene on Saturday to discuss 
	- set up meeting on Saturday (will set up time tomorrow)

- Future
	- Spoonacular has Recipe Recommendation - could work for recommender
		- https://spoonacular.com/food-api/docs#Get-Similar-Recipes