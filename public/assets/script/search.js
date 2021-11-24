class AdvancedSearch extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({mode: 'open'});
      // This is the CSS that you'll use for your recipe cards
      var styleElem = document.createElement('style');
      var styles = `
        .search-container {
            margin-top: 20px;
            width: 100%;
            flex-direction: colunm;
        }

        .advanced-box {
            display: block;
            align-items: center;
            border: 1px solid black;
            border-radius: 5px;
            margin-left: 50px;
            float: left;
            width: 100%;
            height: 250px;
            background-color:#f5ba61
        }

        .advanced-box-left {
            display: block;
            align-items: flex-start;
            margin-left: 5px;
            float: left;
            width: 50%;
            height: 100%-10px;
            background-color:#f5ba61
        }

        .advanced-box-right {
            display: block;
            align-items: flex-start;
            margin-left: -30px;
            float: left;
            width: 50%-10px;
            height: 100%;
            background-color:#f5ba61
        }

        .search-box {
            align-items: center;
            border: 1px solid black;
            border-radius: 5px;
            margin: 20px 0 0 50px ;
            float: left;
            width: 100%;
            height: 100px;
            background-color:#f5ba61
        }

        .clear-preference-box {
            float: left;
        }

        input {
            height: 30px;
            margin: 20px 0 0 20px ;
            font-size: 18px;
        }

        .advanced-box-left input {
            margin: 20px 0 0 20px ;
            width: 80%;
        }

        ul {
            margin: 20px 0 0 20px ;
            width: 60%;
            height: 30px
        }

        button {
            margin: 100px 0 0 10px ;
            font-size: 18px;
            width: 200px;
            height: 50px
        }
        
      `;
      styleElem.innerHTML = styles;
  
      // ============== Container for Whole Search Box ============== 
      // Here's the root element that you'll want to attach all of your other elements to
      const search_container = document.createElement('div');
      search_container.setAttribute('class', 'search-container');
      
      // ============== Container for Whole Search Box ============== 
      var advanced_box = document.createElement('div');
      advanced_box.setAttribute('class', 'advanced-box');
      console.log('here');

      var advanced_box_left = document.createElement('div');
      advanced_box_left.setAttribute('class', 'advanced-box-left');
      var advanced_box_right = document.createElement('div');
      advanced_box_right.setAttribute('class', 'advanced-box-right');

      var add_ingredients_box = document.createElement('input');
      add_ingredients_box.setAttribute('class', 'add-ingredients-box');
      add_ingredients_box.setAttribute('type', 'text');
      add_ingredients_box.setAttribute('placeholder', 'Add Ingredient');
      var remove_ingredients_box = document.createElement('input');
      remove_ingredients_box.setAttribute('class', 'remove-ingredients-box');
      remove_ingredients_box.setAttribute('type', 'text');
      remove_ingredients_box.setAttribute('placeholder', 'Remove Ingredient');
      var clear_preference_button = document.createElement('button');
      clear_preference_button.setAttribute('class', 'clear-preference-box'); 
      clear_preference_button.setAttribute('type', 'button'); 
      clear_preference_button.innerHTML = 'Clear Preferences';
      var ingredients = document.createElement('ul');
      let ingredient_1 = document.createElement('li');
      ingredient_1.innerHTML = 'Apple';
      let ingredient_2 = document.createElement('li');
      ingredient_2.innerHTML = 'Sugar';
      let ingredient_3 = document.createElement('li');
      ingredient_3.innerHTML = 'Flour';
      ingredients.appendChild(ingredient_1);
      ingredients.appendChild(ingredient_2);
      ingredients.appendChild(ingredient_3);

      advanced_box_left.appendChild(add_ingredients_box);
      advanced_box_left.appendChild(remove_ingredients_box);
      advanced_box_left.appendChild(ingredients);
      advanced_box_right.appendChild(clear_preference_button);
      advanced_box.appendChild(advanced_box_left);
      advanced_box.appendChild(advanced_box_right);

      // ============== Container for Ingredients Box ============== 
      var search_box = document.createElement('div');
      search_box.setAttribute('class', 'search-box');

      var search_input = document.createElement('input');
      search_input.setAttribute('class', 'search-text');
      search_input.setAttribute('type', 'text');
      search_input.setAttribute('placeholder', 'Ingredients');
      var search_link = document.createElement('a');
      search_link.setAttribute('class', 'search-btn');
      var search_svg = document.createElement('svg');
      search_svg.setAttribute('class','icon');
      search_svg.setAttribute('viewBox','0 0 1024 1024');
      search_svg.setAttribute('width','30px');
      var search_path_1 = document.createElement('path');
      search_path_1.setAttribute('fill','#e94118');
      search_path_1.setAttribute('p-id','1176');
      search_path_1.setAttribute('d','M424.024 766.098c-91.619 0-177.754-35.679-242.538-100.464-133.735-133.737-133.735-351.344 0-485.078 64.784-64.784 150.919-100.462 242.538-100.462s177.754 35.677 242.539 100.462c133.733 133.735 133.735 351.34 0 485.078-64.785 64.783-150.922 100.464-242.539 100.464zM424.024 196.085c-60.637 0-117.643 23.613-160.523 66.489-88.512 88.51-88.51 232.53 0 321.040 42.876 42.876 99.885 66.491 160.523 66.491s117.643-23.614 160.523-66.491c88.51-88.51 88.51-232.53 0-321.040-42.876-42.876-99.885-66.489-160.523-66.489z');
      var search_path_2 = document.createElement('path');
      search_path_2.setAttribute('fill','#e94118');
      search_path_2.setAttribute('p-id','1177');
      search_path_2.setAttribute('d','M886.838 943.904c-14.842 0-29.684-5.663-41.010-16.986l-261.286-261.285c-22.647-22.649-22.647-59.369 0-82.018 22.647-22.647 59.37-22.647 82.018 0l261.286 261.286c22.647 22.649 22.647 59.369 0 82.018-11.325 11.322-26.167 16.985-41.010 16.985z');
      
      search_svg.appendChild(search_path_1);
      search_svg.appendChild(search_path_2);
      search_link.appendChild(search_svg);
      search_box.appendChild(search_input);
      search_box.appendChild(search_link);

      search_container.appendChild(advanced_box);
      search_container.appendChild(search_box);

  
      this.shadowRoot.appendChild(styleElem);
      this.shadowRoot.appendChild(search_container);
    }
  }
  
  // Define the Class so you can use it as a custom element.
  // This is critical, leave this here and don't touch it
  customElements.define('advanced-search', AdvancedSearch);