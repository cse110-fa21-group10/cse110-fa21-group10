# ADR for MVP (11-24-21)

We had to cut many components of our product for the MVP, and the general reasoning for these changes are going to be listed here.

## Recommendation Page

The recommendation page was cut due to two reasons

1. The integration of query (recipe json file) to recipe card was not functional, and there were still issues with our (working) query to recipe page. 

2. It was being worked on by other team members during this phase, but it would not be completed by the required time. 

## New Front Page

The new front page was created using our proof of concept local storage page, and we hoped to be able to demonstrate a few aspects of our product.

- Local storage (CRUD functionality) was working
- Search functionality (using dietary restriction and ingredients) was functional
- A query would be returned from our API wrapper 
- We could generate a recipe page using the query

## API Key

We did not have time to fully research and implement a safe way to use the API wrapper key, so we used the local storage component of the page to also store a key from the user. This is a stop-gap implementation and is intended to be replaced for the final project. 


## Generated Recipe Page

Our original wireframe used recipe cards from the recommendation page to populate the footer of the recipe page. However, these were not yet functional, so this section was not functional.

