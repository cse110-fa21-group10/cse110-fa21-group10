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
          margin-top: 50px;
          margin-left: 50px;
          align-items: center;
          border: 1px solid rgb(223, 225, 229);
          border-radius: 8px;
          display: grid;
          grid-template-rows: 200px 150px;
          height: auto;
          row-gap: 5px;
          padding: 0 10px 10px 10px;
          width: 300px;
          float: left;
        }

        a {
          text_decoration: none;
        }

        a:hover {
          text_decoration: underline;
        }

        .recipe-card-text {
          display: inline-flexbox;
          margin-top: 15px;
        }
  
        .ingredients {
          height: 50px;
          line-height: 25px;
          overflow: hidden;
          white-space: normal;
          width: 100%;
          align-items: left;
          padding-right: 50px;
        }
        
  
        .recipe-title {
          display: -webkit-box;
          font-size: 20px;
          height: 25px;
          line-height: 25px;
          overflow: hidden;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
  
        p:not(.recipe-title), time {
          color: #4d4d4d;
          font-size: 18px;
        }
        
        .recipe-top-media {
          display: inline_block;
          position: relative;
          max-width: 100%;
          vertical-align: middle;
        }
        
        .recipe-image {
          margin-left: -10px;
          border-radius: 10px;
          object-fit: cover;
          width: 100%;
          height: 200px;
          width: 320px;
          vertical-align: middle;
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
      `;
      styleElem.innerHTML = styles;
  
      // ============== Container for Whole Recipe Card ============== 
      // Here's the root element that you'll want to attach all of your other elements to
      const card = document.createElement('article');

      // ============== Container for Recipe Card Media ============== 
      // Here is the top media part
      var media_div = document.createElement('div');
      media_div.setAttribute('class', 'recipe-top-media');
      // get recipe image from recipe-card json
      var recipe_image = document.createElement('img');
      recipe_image.setAttribute('src', data.image);
      recipe_image.setAttribute('alt', data.title);
      recipe_image.setAttribute('class', 'recipe-image');
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
      media_div.appendChild(recipe_image);
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
      title_link.setAttribute('href', 'recipe-page.html');
      title_link.innerHTML = searchForKey(data, 'title');
      title.appendChild(title_link);
  
      // get cooking time from 
      var time = document.createElement('time');
      time.innerHTML = '<b>Cook time: </b>' + searchForKey(data, 'readyInMinutes') + ' min';
  
      // get ingredients from 
      var pIngred = document.createElement('p');
      pIngred.setAttribute('class', 'ingredients');
      pIngred.innerHTML = '<b>Ingredients: </b>' + data.extendedIngredients;
      //console.log(data.extendedIngredients);
  
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
  
  // Define the Class so you can use it as a custom element.
  // This is critical, leave this here and don't touch it
  customElements.define('recipe-card', RecipeCard);