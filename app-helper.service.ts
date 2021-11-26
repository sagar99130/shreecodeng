import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';


import { log } from 'util';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { LocalService } from './local.service';
function _window(): any {
  // return the global native browser window object
  return window;
}
@Injectable({
  providedIn: 'root'
})
export class AppHelperService {

  public cartCount:any;
  loading: any;
  alert: any;
  toast: any;
  endthLevelCategory: any;

  addProductCategoryAttributes = [];
  addProductCategoryAttributes1 = [];
  addProductSelectedHashtags: any;
  selectedAttributesUsingHashTags: any[];
  selectedAttributesForView = [];
  selectedAttributesHastagsIDS: any[];


  selectedStateIds = [];
  selectedStateName = [];
  selectedCityIds = [];
  selectedCityName = [];

  cart_total_count = 0;
  unread_notification_count=0;
  generatedVariants = [];
  sortActionsheet: any;
  edit_product_images: any;
  businessDetail: any;
  business_gallery: any;
  subcategoryList: any;
  opengalleryImage: any;
  duplicate_address_data: any;
  editUserDetail: any;
  returnDetail: any;
  current_Variant: any
  gallery_id: any;
  veriantScreen: any;
  selectedcityandproduct: any;
  whichscreen_filter = 'home';

  //For image gallery
  productImages:any;
  //From order screen to hide/show parcel acceptance ratio
  isFromOrderScreen:any; 

  //For brand to seller profile
  objBrand:any;

  //For home to product url to fetch product like popular trading etc
  objSectionData:any;

  //For category page view all attibute
  objAttribute:any;

  //For Search flow to keep searchData
  searchData:any;
  categoryId:any

  //For event and product promotion
  categoryIds:any;
  banner_type:any;

  // For Create return reasons
  arrReturnReasons:any;

  //For Create dispute reasons
  arrDisputeReasons:any;

  isLogin=false;
  categoryChange = new BehaviorSubject<any>([]);
  logout=new BehaviorSubject<boolean>(false);
  objSelectedCategory:any;
  objSelectedProductForCart:any;
  objUser: any;
  constructor(private spinner: NgxSpinnerService,@Inject(PLATFORM_ID) private platformId: object, public localService:LocalService,
  private route:Router) {
    this.cart_total_count = parseInt(window.localStorage.getItem("cart_total_count") != null ? window.localStorage.getItem("cart_total_count") : '0');
  }
  get nativeWindow(): any {
    if (isPlatformBrowser(this.platformId)) {
      return _window();
    }
  }

  onChangeCategory(category){
    this.categoryChange.next(category);
  }

  onClickLogout(){
    this.logout.next(false)
  }
  setdata(obj) {
    window.localStorage.setItem("sectionlist", '');
    this.addProductCategoryAttributes1 = [];
    obj.forEach(element => {
      this.addProductCategoryAttributes1.push(element)
    });
    window.localStorage.setItem("sectionlist", JSON.stringify(this.addProductCategoryAttributes1))
  }

  getdata() {
    var retrunarray = []
    this.addProductCategoryAttributes1.forEach(element => {
      retrunarray.push(element)
    });
    return this.addProductCategoryAttributes1;
  }

  // generate unique token 
  generatinguniqueID() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 20; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }

  

  public async dismissLoader(): Promise<void> {
    if (this.loading) {
      await this.loading.dismiss();
    }
  }

 
 


  
  public async dismissToast(): Promise<void> {
    if (this.toast) {
      await this.toast.dismiss();
    }
  }

  public endLevelCategory(category_list) {
    this.endthLevelCategory = [];
    for (var i = 0; i < category_list.length; i++) {
      if (category_list[i]['childs'].length > 0) {
        this.getChildCategory(category_list[i]['childs']);
      } else {
        this.endthLevelCategory.push({ id: category_list[i]['id'], name: category_list[i]['category_name'] });
      }
    }
    return this.endthLevelCategory;
  }

  public getChildCategory(category_list) {
    for (var j = 0; j < category_list.length; j++) {
      if (category_list[j]['childs'].length > 0) {
        this.getChildCategory(category_list[j]['childs']);
      } else {
        this.endthLevelCategory.push({ id: category_list[j]['id'], name: category_list[j]['category_name'] });
      }
    }
  }

  public generateProcessVariants(variantsDetails, attributes, fromscreen) {
    var generatedArray = []
    for (var i = 0; i < attributes.length; i++) {
      var attr_filter = { attribute_id: attributes[i] };
      var filterhash = this.addProductSelectedHashtags.filter(function (item) {
        for (var filter_key in attr_filter) {
          if (item[filter_key] == undefined || item[filter_key] != attr_filter[filter_key])
            return false;
        }
        return true;
      })
      generatedArray.push(filterhash);
    }
    if (fromscreen == 'add') {
      this.generatedVariants = [];
    }
    if (generatedArray.length > 1) {
      for (i = 1; i < generatedArray.length; i++) {
        if (i == 1) {
          this.generateVariants(generatedArray[0], generatedArray[i], variantsDetails, generatedArray.length, fromscreen);
        } else {
          this.generateVariants(this.generatedVariants, generatedArray[i], variantsDetails, generatedArray.length, fromscreen);
        }
      }
    } else {
      this.generateVariants(generatedArray[0], generatedArray[0], variantsDetails, generatedArray.length, fromscreen);
    }
  }

  public generateVariants(attributesArray1, attributesArray2, variantsDetails, variant_array_length, screen) {
    if (variant_array_length == 1) {
      for (var i = 0; i < attributesArray1.length; i++) {
        var generatedData = {};
        var variantTitle = attributesArray1[i]['hashtag_name'];
        if (variantsDetails['variant_title']) {
          generatedData['variant_title'] = variantsDetails['variant_title'] + ' - ' + variantTitle;
        } else {
          generatedData['variant_title'] = variantTitle;
        }
        var objAttr1 = attributesArray1[i];
        var objData1 = {};
        if (objAttr1.id.includes("new_")) {
          objData1['attribute_id'] = objAttr1.attribute_id;
          objData1['hashtag_id'] = "";
          objData1['new_hashtag'] = objAttr1.hashtag_name;
        }
        else {
          objData1['attribute_id'] = objAttr1.attribute_id;
          objData1['hashtag_id'] = objAttr1.id;
          objData1['new_hashtag'] = ""
        }
        generatedData['attribute_hashtag'] = [];
        generatedData['image'] = [];
        generatedData['attribute_hashtag'].push(objData1);
        generatedData['expiry_days'] = variantsDetails['expiry_days'];
        generatedData['generated_id_for_edit'] = this.generatinguniqueID();
        generatedData['gst_tax'] = variantsDetails['gst_tax'];
        generatedData['is_variant'] = variantsDetails['is_variant'];
        generatedData['max_retail_price'] = variantsDetails['max_retail_price'];
        generatedData['minimum_order_quantity'] = variantsDetails['minimum_order_quantity'];
        generatedData['peice_per_set'] = variantsDetails['peice_per_set'];
        generatedData['price'] = variantsDetails['price'];
        generatedData['status'] = variantsDetails['status'];
        generatedData['variant_type'] = variantsDetails['variant_type'];
        this.generatedVariants.push(generatedData);
      }
    } else {
      for (var i = 0; i < attributesArray1.length; i++) {
        for (var j = 0; j < attributesArray2.length; j++) {
          var generatedData = {};
          //generatedData = variantsDetails;
          var variantTitlenew = attributesArray1[i]['hashtag_name'] + '-' + attributesArray2[j]['hashtag_name'];

          if (variantsDetails['variant_title']) {
            generatedData['variant_title'] = variantsDetails['variant_title'] + ' - ' + variantTitlenew;
          } else {
            generatedData['variant_title'] = variantTitlenew;
          }


          //Start JD commented
          // if (variantsDetails['attribute_hastag_id']) {
          //   generatedData['attribute_hastag_id'] = variantsDetails['attribute_hastag_id'] + ', ' + variantIDS
          // } else {
          //   generatedData['attribute_hastag_id'] = variantIDS;
          // }          

          //Start JD For new array
          var objAttr1 = attributesArray1[i];
          var objAttr2 = attributesArray2[j];
          var objData1 = {};
          var objData2 = {};
          if (objAttr1.id.includes("new_")) {
            objData1['attribute_id'] = objAttr1.attribute_id;
            objData1['hashtag_id'] = "";
            objData1['new_hashtag'] = objAttr1.hashtag_name;

          }
          else {
            objData1['attribute_id'] = objAttr1.attribute_id;
            objData1['hashtag_id'] = objAttr1.id;
            objData1['new_hashtag'] = ""
          }

          if (objAttr2.id.includes("new_")) {
            objData2['attribute_id'] = objAttr2.attribute_id;
            objData2['hashtag_id'] = "";
            objData2['new_hashtag'] = objAttr2.hashtag_name;

          }
          else {
            objData2['attribute_id'] = objAttr2.attribute_id;
            objData2['hashtag_id'] = objAttr2.id;
            objData2['new_hashtag'] = ""
          }

          generatedData['is_delete'] = true;

          //End JD For new array
          generatedData['attribute_hashtag'] = [];
          generatedData['attribute_hashtag'].push(objData1);
          generatedData['attribute_hashtag'].push(objData2);
          generatedData['generated_id_for_edit'] = this.generatinguniqueID();
          generatedData['expiry_days'] = variantsDetails['expiry_days'];
          generatedData['gst_tax'] = variantsDetails['gst_tax'];
          generatedData['is_variant'] = variantsDetails['is_variant'];
          generatedData['max_retail_price'] = variantsDetails['max_retail_price'];
          generatedData['minimum_order_quantity'] = variantsDetails['minimum_order_quantity'];
          generatedData['peice_per_set'] = variantsDetails['peice_per_set'];
          generatedData['price'] = variantsDetails['price'];
          generatedData['status'] = variantsDetails['status'];
          generatedData['variant_type'] = variantsDetails['variant_type'];
          this.generatedVariants.push(generatedData);


        }
      }
    }
  }



  sortproduct(sort_type) {

  }

  public calculateGST(price, gst_tax) {
    return parseFloat(price) * (parseFloat(gst_tax) / 100);
  }

  public calculatePrice(price, gst_tax) {
    return (parseFloat(price) + (parseFloat(price) * (parseFloat(gst_tax) / 100))).toFixed(2);
  }

  public calculatePriceWithGST(price, gst_tax) {
    return (parseFloat(price) + (parseFloat(price) * (parseFloat(gst_tax) / 100))).toFixed(2);
  }

  public calculatePriceWithQTY(price, qty) {
    return (parseFloat(price) * (parseFloat(qty))).toFixed(2);
  }

  public getCalcuationCartFinalData(data) {
    let totalPrice = 0;
    let totalQty = 0;
    let finalPrice = 0;
    let totalGST = 0;
    for (var i = 0; i < data.length; i++) {
      if (data[i]['quantity'] > 0) {
        totalQty += parseInt(data[i]['quantity']);
        totalGST += this.calculateGST(this.calculatePriceWithQTY(data[i]['price'], data[i]['quantity']), data[i]['gst_tax']);
        totalPrice += parseFloat(this.calculatePriceWithQTY(data[i]['price'], data[i]['quantity']));
        
      }
    }
    finalPrice = totalPrice + totalGST;
    return { finalPrice: finalPrice.toFixed(2), totalPrice: totalPrice.toFixed(2), totalGST: totalGST.toFixed(2), totalQty: totalQty };
  }

  public 
  checkVerifyBusinessWithsellerRequest(type) {
    let userDetail = JSON.parse(window.localStorage.getItem("userdetail"));
    if (type == 'verified') {
      if (userDetail.PlatformCluster.is_verify) {
        return true
      } else {
        return false
      }
    } else if (type == 'verify-now') {
      if (userDetail.PlatformCluster.is_verify == null && userDetail.PlatformCluster.documents.length == 0) {
        return true
      } else {
        return false;
      }
    } else if (type == 'under-process') {
      if (userDetail.PlatformCluster.is_verify == null && userDetail.PlatformCluster.documents.length > 0) {
        var returndata = false;
        for (let i = 0; i < userDetail.PlatformCluster.documents.length; i++) {
          if (userDetail.PlatformCluster.documents[i]['document_call_verify_status'] == "PENDING" || userDetail.PlatformCluster.documents[i]['document_call_verify_status'] == "FOLLOW_UP" || userDetail.PlatformCluster.documents[i]['document_call_verify_status'] == "NOT_PICK_UP") {
            returndata = true;
            break;
          }
        }
        return returndata;
      } else {
        return false;
      }
    } else if (type == 'GSTN-under-process') {
      if (userDetail.PlatformCluster.documents.length > 0) {
        var returndata = false;
        for (let i = 0; i < userDetail.PlatformCluster.documents.length; i++) {
          if (userDetail.PlatformCluster.documents[i]['document_type'] == 'GSTIN') {
            if (userDetail.PlatformCluster.documents[i]['document_call_verify_status'] == "PENDING" || userDetail.PlatformCluster.documents[i]['document_call_verify_status'] == "FOLLOW_UP" || userDetail.PlatformCluster.documents[i]['document_call_verify_status'] == "NOT_PICK_UP") {
              returndata = true;
              break;
            }
          }
        }
        return returndata;
      } else {
        return false;
      }
    } else if (type == 'reject') {
      if (userDetail.PlatformCluster.is_verify == null && userDetail.PlatformCluster.documents.length > 0) {
        var returndata = false;
        var allDocsStatus = []
        for (let i = 0; i < userDetail.PlatformCluster.documents.length; i++) {
          allDocsStatus.push(userDetail.PlatformCluster.documents[i]['document_call_verify_status'])
        }
        if (allDocsStatus.includes('Y')) {
          returndata = false
        } else {
          if (allDocsStatus.includes('PENDING') || allDocsStatus.includes('FOLLOW_UP') || allDocsStatus.includes('NOT_PICK_UP')) {
            returndata = false
          } else {
            returndata = true
          }
        }
        return returndata;
      } else {
        return false;
      }
    } else if (type == 'become-seller-verify-now') {
      var retrurndata = false
      if (userDetail.user_type == 'buyer' && userDetail.become_supplier_request == null && userDetail.PlatformCluster.documents.length == 0) {
        retrurndata = true;
      }
      return retrurndata;
    }
  }



  showLoader(){
    this.spinner.show();
  }

  hideLoader(){
    this.spinner.hide();
  }
  
  onClickRedirectPage(banner) {

    if (banner.banner_type == 'category' && banner.category_name) {
      this.localService.setJsonValue('categoryId',banner.category_id);
      this.localService.setJsonValue('categoryName',banner.category_name);
      this.route.navigate(['/products', banner.category_id,banner.category_name]);
    } else if (banner.banner_type == 'product' && banner.product_id) {
      this.route.navigate(['products/productDetails/' + banner.product_id + '/' + banner.product_name]);
    } else if (banner.banner_type == 'seller' && banner.cluster_id) {
      this.route.navigate(['profile/seller-details/' + banner.cluster_id]);
    } else if (banner.banner_type == 'LINK' && banner.link_document_url) {
      window.open(banner.link_document_url, '_blank');
    }
  }

  public getcartItem(){
   return this.userCartItem(null);
  }
  public userCartItem(getCartItemVal){
    if(getCartItemVal == 'plus'){
      let objUserVal = JSON.parse(this.localService.getJsonValue('user_details'));
       this.cartCount = objUserVal.cart_count++;
       this.localService.setJsonValue('user_details', JSON.stringify(objUserVal));
       console.log('plus', objUserVal);
       return this.cartCount;
     } else if (getCartItemVal == 'minus'){
      let objUserVal = JSON.parse(this.localService.getJsonValue('user_details'));
      this.cartCount = objUserVal.cart_count--;
      this.localService.setJsonValue('user_details', JSON.stringify(objUserVal));
      // console.log('minus', this.cartCount);
      return this.cartCount;
    } else if (getCartItemVal){
      return this.cartCount = getCartItemVal;
    } else {
      let objUserVal = JSON.parse(this.localService.getJsonValue('user_details'));
      return this.cartCount = objUserVal.cart_count;
    }

  }
}


