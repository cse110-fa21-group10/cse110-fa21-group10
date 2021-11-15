# ADR for CI/CD Pipeline

## Context and Problem Statement

We want to record architectural decisions for our plans for Continuous Integration and Delivery

## Considered Options

* Search engine/recommendation testing
* Test to see if user preferences are saved
* Query testing
* Test app deployment
* Style guide enforcement

## Reasons for Options

### Search engine/recommendation testing

* Test to make sure our search function and our user preference recommendation system works which is one of the core features of our app

### Test to see if user preferences are saved

* Assuming that the profile preferences feature doesn't get scratched, we'd want to be able to have user preferences saved if they leave the page, lose connection, etc.

### Query testing

* Need to test to the make sure that our app is able to obtain the data for all the recipes to be displayed on our recommendations, our search results, and to display the recipe itself

### Test app deployment

* We need to make sure that the application works when *possibly* a new feature is added and need to make sure that the feature works in its entirety and doesn't break any other part of the app.

### Style guide enforcement

* We need to make sure all code that gets pushed/PR'd follows a specific style guide to ensure if other team members/TA/professor needs to look at the code, that they're able to tell what is happening in our code.

## How these tests plan to be implemented will be explained in the 'cipipeline' folder