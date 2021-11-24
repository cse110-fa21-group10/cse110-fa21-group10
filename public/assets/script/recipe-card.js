// ============================================== Recipe Card Template ==============================================
// <recipe-card class="recipe-card">
//   <article>
//     <div class="recipe-top-media">
//       <img class="recipe-image" src="public/source/img/RecipeTemplate/600x600.jpg" alt="recipe-image" />
//       <div class="recipe-like-icon">
//         <a href="#" class="like-icon">
//           <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" data-svg="heart">
//             <path fill="none" stroke="#000" stroke-width="1.03" d="M10,4 C10,4 8.1,2 5.74,2 C3.38,2 1,3.55 1,6.73 C1,8.84 2.67,10.44 2.67,10.44 L10,18 L17.33,10.44 C17.33,10.44 19,8.84 19,6.73 C19,3.55 16.62,2 14.26,2 C11.9,2 10,4 10,4 L10,4 Z"></path>
//           </svg>
//         </a>
//       </div> 
//     </div>
//     <div class="recipe-card-text">   
//       <p class="recipe-title">Recipe Title</p>
//     </div>
//   </article>
// </recipe-card> 

class RecipeCard extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({mode: 'open'});
    }
  
    set data(data) {
      // This is the CSS that you'll use for your recipe cards
      var styleElem = document.createElement('style');
      var styles = `
        
        article {
          align-items: center;
          border: 1px solid rgb(223, 225, 229);
          border-radius: 8px;
          display: grid;
          grid-template-rows: 118px 56px 14px 18px 15px 36px;
          height: auto;
          row-gap: 5px;
          padding: 0 16px 16px 16px;
          width: 178px;
        }
  
        article > img {
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
          height: 200px;
          object-fit: cover;
          margin-left: 16px;
          width: calc(100% + 32px);
        }
  
        p.ingredients {
          height: 32px;
          line-height: 16px;
          padding-top: 4px;
          overflow: hidden;
        }
        
  
        p.title {
          display: -webkit-box;
          font-size: 16px;
          height: 36px;
          line-height: 18px;
          overflow: hidden;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
  
        p:not(.title), span, time {
          color: #70757A;
          font-size: 32px;
        }

        .recipe-card {
          margin: 10px;
          border: 1px solid #dfdfdf;
          border-radius: 8px;
          padding: 10px;
          width: 400px;
          /* do your own width, height */
        }
        
        .recipe-top-media {
          display: inline_block;
          position: relative;
          max-width: 100%;
          vertical-align: middle;
        }
        
        .recipe-image {
          margin-right: 10px;
          margin-left: 10px;
          height: 200px;
          width: 500px;
          max-width: 100%;
          border-radius: 10px;
          vertical-align: middle;
          box-sizing: border-box;
        
          background: rgba(0, 0, 0, 0.16);
        }
        
        .recipe-love-icon {
          display: inline-flex;
          width: 32px;
          height: 32px;
          border-radius: 500px;
          vertical-align: middle;
          justify-content: center;
          align-items: center;
          margin: 10px;
          top: 0;
          right: 0;
          position: absolute;
          max-width: 100%;
          fill: currentColor;
          color: #fff;
          background-color: rgba(255, 255, 255, 0.1);
        
          transition: 0.1s ease-in-out;
          transition-property: color, background-color;
        }
        
        .recipe-love-icon:hover {
          background-color: #d0d0d0;
          color: #000;
          outline: none;
        }
        
        .recipe-love-icon:active {
          background-color: rgba(230, 230, 230, 0.1);
          color: #fff;
        }
        
        .recipe-card-text {
          display: inline-flexbox;
          margin-top: 20px;
        }
        
        .recipe-title {
          /* do your own width, height */
          align-items: center;
          margin-top: 20px;
          font-size: 0.9375rem;
          line-height: 1.4;
        }
        
        .recipe-description {
          /* do your own height */
          overflow: hidden;
          white-space: normal;
          width: 55%;
          align-items: left;
          padding-right: 50px;
        }
      `;
      styleElem.innerHTML = styles;
  
      // ============== Container for Whole Recipe Card ============== 
      // Here's the root element that you'll want to attach all of your other elements to
      var card = document.createElement('article');

      // ============== Container for Recipe Card Media ============== 
      // Here is the top media part
      var media_div = document.createElement('div');
      media_div.setAttribute('class', 'recipe-top-media');
      // get recipe image from recipe-card json
      var image = document.createElement('img');
      image.setAttribute('src', data.image);
      image.setAttribute('alt', data.title);
      image.setAttribute('class', 'recipe-image');
      // Here is the icon part
      var love_icon_div = document.createElement('div');
      love_icon_div .setAttribute('class', 'recipe-love-icon');
      // set up love icon
      var icon_link = document.createElement('a');
      icon_link.setAttribute('href','#');
      icon_link.setAttribute('class','love-icon');
      var icon_svg = document.createElement('svg');
      icon_svg .setAttribute('width','20');
      icon_svg .setAttribute('height','20');
      icon_svg .setAttribute('viewBox','0 0 20 20');
      icon_svg .setAttribute('xmlns','http://www.w3.org/2000/svg');
      icon_svg .setAttribute('data-svg','heart');
      var icon_path = document.createElement('path');
      icon_path .setAttribute('fill','none');
      icon_path .setAttribute('stroke','#000');
      icon_path .setAttribute('stroke_width','1.03');
      icon_path .setAttribute('d','M10,4 C10,4 8.1,2 5.74,2 C3.38,2 1,3.55 1,6.73 C1,8.84 2.67,10.44 2.67,10.44 L10,18 L17.33,10.44 C17.33,10.44 19,8.84 19,6.73 C19,3.55 16.62,2 14.26,2 C11.9,2 10,4 10,4 L10,4 Z');
      icon_svg.appendChild(icon_path);
      icon_link.appendChild(icon_svg);
      love_icon_div.appendChild(icon_link);

      // fill our media container
      media_div.appendChild(image);
      media_div.appendChild(love_icon_div);
  
      // ============== Container for Recipe Card Text ============== 
      // Here is the text part div
      var text_div = document.createElement('div');
      text_div .setAttribute('class', 'recipe-card-text');
      // get title image from recipe-card json
      var title= document.createElement('p');
      title.setAttribute('class','recipe-title');
      // get link image from recipe-card json
      var title_link = document.createElement('a');
      title_link.setAttribute('href', searchForKey(data, 'sourceUrl'));
      title_link.innerHTML = searchForKey(data, 'title');
      title.appendChild(title_link);
  
      // get cooking time from 
      var time = document.createElement('time');
      time.innerHTML = searchForKey(data, 'readyInMinutes') + ' min';
  
      // get ingredients from 
      var pIngred = document.createElement('p');
      pIngred.setAttribute('class', 'ingredients');
      pIngred.innerHTML =  createIngredientList(searchForKey(data, 'extendedIngredients'));
  
      // fill our text container
      text_div.appendChild(title);
      text_div.appendChild(time);
      text_div.appendChild(pIngred);

      // fill our recipe cards
      card.appendChild(media_div);
      card.appendChild(text_div);
  
      this.shadowRoot.appendChild(styleElem);
      this.shadowRoot.appendChild(card);
    }
  }
  
  
  /*********************************************************************/
  /***                       Helper Functions:                       ***/
  /***          Below are some functions I used when making          ***/
  /***     the solution, feel free to use them or not, up to you     ***/
  /*********************************************************************/
  
  /**
   * Recursively search for a key nested somewhere inside an object
   * @param {Object} object the object with which you'd like to search
   * @param {String} key the key that you are looking for in the object
   * @returns {*} the value of the found key
   */
  function searchForKey(object, key) {
    var value;
    Object.keys(object).some(function (k) {
      if (k === key) {
        value = object[k];
        return true;
      }
      if (object[k] && typeof object[k] === 'object') {
        value = searchForKey(object[k], key);
        return value !== undefined;
      }
    });
    return value;
  }
  
  /**
   * Extract the URL from the given recipe schema JSON object
   * @param {Object} data Raw recipe JSON to find the URL of
   * @returns {String} If found, it returns the URL as a string, otherwise null
   */
  function getUrl(data) {
    if (data.url) return data.url;
    if (data['@graph']) {
      for (let i = 0; i < data['@graph'].length; i++) {
        if (data['@graph'][i]['@type'] == 'Article') return data['@graph'][i]['@id'];
      }
    };
    return null;
  }
  
  /**
   * Similar to getUrl(), this function extracts the organizations name from the
   * schema JSON object. It's not in a standard location so this function helps.
   * @param {Object} data Raw recipe JSON to find the org string of
   * @returns {String} If found, it retuns the name of the org as a string, otherwise null
   */
  function getOrganization(data) {
    if (data.publisher?.name) return data.publisher?.name;
    if (data['@graph']) {
      for (let i = 0; i < data['@graph'].length; i++) {
        if (data['@graph'][i]['@type'] == 'Organization') {
          return data['@graph'][i].name;
        }
      }
    };
    return null;
  }
  
  /**
   * Converts ISO 8061 time strings to regular english time strings.
   * Not perfect but it works for this lab
   * @param {String} time time string to format
   * @return {String} formatted time string
   */
  function convertTime(time) {
    let timeStr = '';
  
    // Remove the 'PT'
    time = time.slice(2);
  
    let timeArr = time.split('');
    if (time.includes('H')) {
      for (let i = 0; i < timeArr.length; i++) {
        if (timeArr[i] == 'H') return `${timeStr} hr`;
        timeStr += timeArr[i];
      }
    } else {
      for (let i = 0; i < timeArr.length; i++) {
        if (timeArr[i] == 'M') return `${timeStr} min`;
        timeStr += timeArr[i];
      }
    }
  
    return '';
  }
  
  /**
   * Takes in a list of ingredients raw from imported data and returns a neatly
   * formatted comma separated list.
   * @param {Array} ingredientArr The raw unprocessed array of ingredients from the
   *                              imported data
   * @return {String} the string comma separate list of ingredients from the array
   */
  function createIngredientList(ingredientArr) {
    let finalIngredientList = '';
  
    /**
     * Removes the quantity and measurement from an ingredient string.
     * This isn't perfect, it makes the assumption that there will always be a quantity
     * (sometimes there isn't, so this would fail on something like '2 apples' or 'Some olive oil').
     * For the purposes of this lab you don't have to worry about those cases.
     * @param {String} ingredient the raw ingredient string you'd like to process
     * @return {String} the ingredient without the measurement & quantity 
     * (e.g. '1 cup flour' returns 'flour')
     */
    function _removeQtyAndMeasurement(ingredient) {
      return ingredient.split(' ').splice(2).join(' ');
    }
  
    ingredientArr.forEach(ingredient => {
      ingredient = _removeQtyAndMeasurement(ingredient);
      finalIngredientList += `${ingredient}, `;
    });
  
    // The .slice(0,-2) here gets ride of the extra ', ' added to the last ingredient
    return finalIngredientList.slice(0, -2);
  }
  
  // Define the Class so you can use it as a custom element.
  // This is critical, leave this here and don't touch it
  customElements.define('recipe-card', RecipeCard);