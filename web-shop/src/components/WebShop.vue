/* vim: set softtabstop=2 shiftwidth=2 expandtab : */
<template>
  <div class="app-panel">
      <div class="settings-panel">
        <!--Web shop mode -->
        <div v-if="mode == 'webshop'">
          <!-- Switch mode to basket-->
          <button class="btn btn-success"  v-on:click="switchMode('basket')">
            Visit Basket
          </button>

          <!--Display products if available-->
          <h3 v-if="title != undefined" class="fixSpaces">{{ title }}</h3>

          <!--Product list -->
          <div v-if="availableProducts != undefined">
            <div class="list-group" style="width: 90%; margin: 0 auto;">
              <a href="javascript:void(0)" v-for="(product, index) in availableProducts"
                 v-on:click="displayProduct(product)">
                <h6 class="fixSpaces" style="text-align: left; color: black; text-decoration: none !important;">{{index}}. {{ product.title }} - {{ product.description }} - {{ product.price }}  {{ product.id }} </h6>
              </a>
            </div>
          </div>

          <br>
          <!--Display selected product-->
          <div v-if="selectedProduct != undefined">
            <div id="placeData">
              <h5 class="fixSpaces">
                Code : {{ selectedProduct.id }}<br>
                Name : {{ selectedProduct.title }}<br>
                Description : {{ selectedProduct.description }}<br>
                Price : {{ selectedProduct.price }} Euro
              </h5>
              <!--Add to basket button-->
              <button class="btn btn-success"  v-on:click="addProduct(selectedProduct)">
                <h5 class="fixSpaces"> Add to basket</h5>
              </button>

              <!--product counter-->
              <div v-if="selectedProduct != undefined">
                <h5 class="fixSpaces">You have order {{ selectedProductCounter }} items of this product</h5>
              </div>
            </div>
          </div>
        </div>

        <!--Basket mode-->
        <div v-if="mode == 'basket'">
          <!--Switch to web shop mode-->
          <button class="btn btn-success"  v-on:click="switchMode('webshop')">
            Visit Webshop
          </button>

          <!--Display selected products-->
          <div class="list-group" style="width: 90%; margin: 0 auto;">
            <div  v-for="product in availableProducts" >
              <div v-if="productMap[product.id] != 0">
                <h6 class="fixSpaces" style="text-align: left; color: black; text-decoration: none !important;"> {{ product.id }} - {{ product.title }} - {{ product.description }} - {{ product.price }} - {{ productMap[product.id] }}
                  <button class="btn btn-success"  v-on:click="addProduct(product)">+</button>
                  <button class="btn btn-success"  v-on:click="removeProduct(product)">-</button>
                </h6>
              </div>
            </div>

          </div>
            <br>
            <!--Display payment details-->
            <div id="placeBasket">
              <h5 class="fixSpaces">
                Discount: {{ basket.discount }} %<br>
                Delivery Cost: {{ basket.deliveryCost }} Euro<br>
                Total Price: {{ basket.totalPrice }} Euro
              </h5>
            </div>
        </div>
      </div>
  </div>
</template>

<style>
  .app-panel {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: row;
  }

  .settings-panel {
    overflow-y: scroll;
    flex: 1 0 500px;
  }

  .fixSpaces {
    margin: 2px;
    padding-top: 0px;
    padding-bottom: 0px;
  }

  #placeData, #placeBasket {
    width: 90%;
    margin: 0 auto;
    padding: 0px;
    vertical-align: middle;
    text-align: left;
    color: black;
    display: table;
    border: groove;
  }
</style>

<script>
  /* eslint-disable */
  import Vue from 'vue';
  import vueResource from 'vue-resource';


  export default {
    data: function (){
      // initial data values
      return {
        initialize: this.initializeVue(),
        mode: 'webshop',
        title: undefined,
        selectedProduct: undefined,
        selectedProductCounter: undefined,
        productMap: undefined,
        availableProducts: undefined,
        basket: undefined,
        isNotificationShown: false
      };
    },

    methods: {
      initializeVue() {
        this.getAvailableProducts();
        this.getBasket();
      },

      getAvailableProducts() {
        // create request url string
        let requestString = process.env.apiUrl+'/rest/v1/getProducts';
        if (this.availableProducts === undefined) {
          Vue.use(vueResource);
          // request products from running environment
          return Vue.http.get(requestString)
            .then((response) => {
              // initialise available Products
              this.availableProducts = response.body.results;
              // set title
              if (this.availableProducts != undefined && this.availableProducts.length > 0) {
                this.title = 'Select Product:';
              }
            })
            //error handling
            .catch((errorResponse) => {
              return errorResponse;
            })
        }
      },

      //show notification only once when discount in not 0
      showNotification() {
        if (this.basket.discount == 0) {
          this.isNotificationShown = false;
          return false;
        }
        if (!this.isNotificationShown && this.basket.discount != 0) {
          this.isNotificationShown = true;
          return true;
        }
        return false;
      },

      getBasket() {
        // create request url string
        let requestString = process.env.apiUrl + '/rest/v1/getBasket';
        Vue.use(vueResource);
        // request basket from running environment
        return Vue.http.get(requestString)
          .then((response) => {
            // initialise basket and product map data
            this.basket = response.body;
            this.productMap = response.body.selectedProductMap;
            // show discount notification if applicable
            if (this.showNotification()) {
              this.$notify({
                group: 'webshop',
                title: 'You have 10% discount!!',
                text: 'Your basket contains products which cost more than 100 Euros!'
              });
            }
          })
          //error handling
          .catch((errorResponse) => {
            return errorResponse;
          })
      },

      displayProduct(product) {
        //Update selected product and basket
        this.selectedProduct = product;
        this.getBasket();
        this.selectedProductCounter = this.productMap[product.id];
      },

      addProduct(product) {
        // create request url string
        let requestString = process.env.apiUrl + '/rest/v1/addProduct?id=' + product.id;
        Vue.use(vueResource);
        // request product increment
        return Vue.http.get(requestString)
          .then((response) => {
            // update product counter
            this.selectedProductCounter = response.body.counter;
            //update basket
            this.getBasket();
          })
          //error handling
          .catch((errorResponse) => {
            return errorResponse;
          })
      },

      switchMode(mode) {
        //switch between basket and webshop
        if (mode == 'basket') {
          this.getBasket();
        } else {
          this.selectedProduct = undefined
          this.selectedProductCounter = undefined;
        }
        this.mode = mode;
      },

      removeProduct(product) {
        // create request url string
        let requestString = process.env.apiUrl + '/rest/v1/removeProduct?id=' + product.id;
        Vue.use(vueResource);
        // request product count decrement
        return Vue.http.get(requestString)
          .then((response) => {
            // update product counter
            this.selectedProductCounter = response.body.counter;
            // update basket
            this.getBasket();
          })
          //error handling
          .catch((errorResponse) => {
            return errorResponse;
          })
      }

    },
  };
  /* eslint-enable */
</script>
