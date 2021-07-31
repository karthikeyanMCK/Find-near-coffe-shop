import React, { Component } from 'react';
import { View, Text,StyleSheet,TouchableOpacity,ScrollView,Dimensions,Image} from 'react-native';
import {connect} from 'react-redux';
const {width,height}=Dimensions.get('window')
class MainCategoryScreen extends Component {

  static navigationOptions={header:null}


 state = {
         totalCategoryArray:[
          [{'image':require('../images/book.png'),'data':'primary_school'},{'image':require('../images/book.png'),'data':'school'},{'image':require('../images/book.png'),'data':'library'},{'image':require('../images/book.png'),'data':'secondary_school'},{'image':require('../images/book.png'),'data':'university'}],
          [{'image':require('../images/HomeScreenImages/lasagna.png'),'data':'bakery'},{'image':require('../images/HomeScreenImages/lasagna.png'),'data':'cafe'},{'image':require('../images/HomeScreenImages/lasagna.png'),'data':'restaurant'},{'image':require('../images/HomeScreenImages/lasagna.png'),'data':'bar'},{'image':require('../images/HomeScreenImages/lasagna.png'),'data':'meal_delivery'},{'image':require('../images/HomeScreenImages/lasagna.png'),'data':'meal_takeaway'}],
          [{'image':require('../images/HomeScreenImages/laugh.png'),'data':'movie_theater'},{'image':require('../images/HomeScreenImages/laugh.png'),'data':'night_club'},{'image':require('../images/HomeScreenImages/laugh.png'),'data':'zoo'},{'image':require('../images/HomeScreenImages/laugh.png'),'data':'park'},{'image':require('../images/HomeScreenImages/laugh.png'),'data':'museum'},{'image':require('../images/HomeScreenImages/laugh.png'),'data':'amusement_park'},,{'image':require('../images/HomeScreenImages/laugh.png'),'data':'casino'},{'image':require('../images/HomeScreenImages/laugh.png'),'data':'rv_park'}],
          [{'image':require('../images/HomeScreenImages/doctor.png'),'data':'hospital'},{'image':require('../images/HomeScreenImages/doctor.png'),'data':'dentist'},{'image':require('../images/HomeScreenImages/doctor.png'),'data':'veterinary_care'},{'image':require('../images/HomeScreenImages/doctor.png'),'data':'pharmacy'},{'image':require('../images/HomeScreenImages/doctor.png'),'data':'physiotherapist'}],
          [{'image':require('../images/HomeScreenImages/store.png'),'data':'book_store'},{'image':require('../images/HomeScreenImages/store.png'),'data':'clothing_store'},{'image':require('../images/HomeScreenImages/store.png'),'data':'shoe_store'},{'image':require('../images/HomeScreenImages/store.png'),'data':'jewelry_store'},{'image':require('../images/HomeScreenImages/store.png'),'data':'electronics_store'},{'image':require('../images/HomeScreenImages/store.png'),'data':'shopping_mall'},{'image':require('../images/HomeScreenImages/store.png'),'data':'hardware_store'},{'image':require('../images/HomeScreenImages/store.png'),'data':'bicycle_store'},{'image':require('../images/HomeScreenImages/store.png'),'data':'furniture_store'},{'image':require('../images/HomeScreenImages/store.png'),'data':'pet_store'},{'image':require('../images/HomeScreenImages/store.png'),'data':'liquor_store'},{'image':require('../images/HomeScreenImages/store.png'),'data':'home_goods_store'},{'image':require('../images/HomeScreenImages/store.png'),'data':'supermarket'},{'image':require('../images/HomeScreenImages/store.png'),'data':'florist'},{'image':require('../images/HomeScreenImages/store.png'),'data':'grocery_or_supermarket'},{'image':require('../images/HomeScreenImages/store.png'),'data':'aquarium'},{'image':require('../images/HomeScreenImages/store.png'),'data':'convenience_store'},{'image':require('../images/HomeScreenImages/store.png'),'data':'department_store'},{'image':require('../images/HomeScreenImages/store.png'),'data':'shopping_mall'}],
          [{'image':require('../images/HomeScreenImages/doorman.png'),'data':'beauty_salon'},{'image':require('../images/HomeScreenImages/doorman.png'),'data':'laundry'},{'image':require('../images/HomeScreenImages/doorman.png'),'data':'electrician'},{'image':require('../images/HomeScreenImages/doorman.png'),'data':'locksmith'},{'image':require('../images/HomeScreenImages/doorman.png'),'data':'plumber'},{'image':require('../images/HomeScreenImages/doorman.png'),'data':'lawyer'},{'image':require('../images/HomeScreenImages/doorman.png'),'data':'painter'},{'image':require('../images/HomeScreenImages/doorman.png'),'data':'car_repair'},{'image':require('../images/HomeScreenImages/doorman.png'),'data':'car_wash'},{'image':require('../images/HomeScreenImages/doorman.png'),'data':'fire_station'},{'image':require('../images/HomeScreenImages/doorman.png'),'data':'gas_station'},{'image':require('../images/HomeScreenImages/doorman.png'),'data':'hair_care'},{'image':require('../images/HomeScreenImages/doorman.png'),'data':'insurance_agency'},{'image':require('../images/HomeScreenImages/doorman.png'),'data':'local_government_office'},{'image':require('../images/HomeScreenImages/doorman.png'),'data':'lodging'},{'image':require('../images/HomeScreenImages/doorman.png'),'data':'police'},{'image':require('../images/HomeScreenImages/doorman.png'),'data':'post_office'},{'image':require('../images/HomeScreenImages/doorman.png'),'data':'real_estate_agency'},{'image':require('../images/HomeScreenImages/doorman.png'),'data':'accounting'},{'image':require('../images/HomeScreenImages/doorman.png'),'data':'atm'},{'image':require('../images/HomeScreenImages/doorman.png'),'data':'art_gallery'},{'image':require('../images/HomeScreenImages/doorman.png'),'data':'bank'},{'image':require('../images/HomeScreenImages/doorman.png'),'data':'city_hall'},{'image':require('../images/HomeScreenImages/doorman.png'),'data':'courthouse'},{'image':require('../images/HomeScreenImages/doorman.png'),'data':'embassy'},{'image':require('../images/HomeScreenImages/doorman.png'),'data':'roofing_contractor'},{'image':require('../images/HomeScreenImages/doorman.png'),'data':'car_dealer'},,{'image':require('../images/HomeScreenImages/doorman.png'),'data':'car_rental'},{'image':require('../images/HomeScreenImages/doorman.png'),'data':'spa'},{'image':require('../images/HomeScreenImages/doorman.png'),'data':'storage'},,{'image':require('../images/HomeScreenImages/doorman.png'),'data':'store'}],
          [{'image':require('../images/HomeScreenImages/medal.png'),'data':'gym'},{'image':require('../images/HomeScreenImages/medal.png'),'data':'stadium'},{'image':require('../images/HomeScreenImages/medal.png'),'data':'bowling_alley'},{'image':require('../images/HomeScreenImages/medal.png'),'data':'campground'}],
          [{'image':require('../images/HomeScreenImages/destination.png'),'data':'airport'},{'image':require('../images/HomeScreenImages/destination.png'),'data':'bus_station'},{'image':require('../images/HomeScreenImages/destination.png'),'data':'light_rail_station'},{'image':require('../images/HomeScreenImages/destination.png'),'data':'moving_company'},{'image':require('../images/HomeScreenImages/destination.png'),'data':'subway_station'},{'image':require('../images/HomeScreenImages/destination.png'),'data':'taxi_stand'},{'image':require('../images/HomeScreenImages/destination.png'),'data':'tourist_attraction'},{'image':require('../images/HomeScreenImages/destination.png'),'data':'train_station'},{'image':require('../images/HomeScreenImages/destination.png'),'data':'travel_agency'}],
          [{'image':require('../images/HomeScreenImages/place.png'),'data':'church'},{'image':require('../images/HomeScreenImages/place.png'),'data':'cementery'},{'image':require('../images/HomeScreenImages/place.png'),'data':'drugstore'},{'image':require('../images/HomeScreenImages/place.png'),'data':'funeral_home'},{'image':require('../images/HomeScreenImages/place.png'),'data':'hindu_temple'},{'image':require('../images/HomeScreenImages/place.png'),'data':'mosque'},{'image':require('../images/HomeScreenImages/place.png'),'data':'movie_rental'},{'image':require('../images/HomeScreenImages/place.png'),'data':'synagogue'}]
        ],

          
    };
 
   
  async setSearchKey(value){
    await this.props.setMainSearchKey(value)
    console.warn(this.props.mainSearchKey)
    this.props.navigation.navigate('ExactKeyScreen')
    }

  
  render() {
    return (
      <View style={styles.mainContainer}>
         <View style={{width:'100%',height:'15%',backgroundColor:'#13a4da'}}>
          </View>

        
            <ScrollView >
                <View style={{marginVertical:20,flexDirection:'row',flexWrap:'wrap',justifyContent:'space-evenly'}}>
                    {
                      this.state.totalCategoryArray[this.props.mainCategoryIndex].map((data,index)=>
                      {
                        if(data.data=='cafe')
                        {
                          return(
                            <TouchableOpacity key={index} style={[{width:width/2.3},{height:width/2.2},{borderColor:'#13a4da',borderWidth:1,marginBottom:10,borderRadius:10},]}
                            onPress={()=>{this.setSearchKey(data.data)}}>
                                <View style={{width:'100%',height:'80%',justifyContent:'center',alignItems:'center'}}>
                                                  <View style={{width:'50%',height:'50%'}}>
                                                      <Image source={data.image} style={{flex:1,width:undefined,height:undefined,resizeMode:'center'}}/>
                                                  </View>
                                                
                                              </View>
                                              <View style={{backgroundColor:'#0078a3',width:'100%',height:'20%',justifyContent:'center',alignItems:'center',borderBottomLeftRadius:10,borderBottomRightRadius:10}}>
                                                  <Text style={{fontSize:14,color:'#FFF',}}>{data.data}</Text>
                                              </View>
                            </TouchableOpacity>)
                        }
                        else{

                          return(
                            <View key={index} style={[{width:width/2.3},{height:width/2.2},{borderColor:'#13a4da',borderWidth:1,marginBottom:10,borderRadius:10},]}
                            onPress={()=>{this.setSearchKey(data.data)}}>
                                <View style={{width:'100%',height:'80%',justifyContent:'center',alignItems:'center'}}>
                                                  <View style={{width:'50%',height:'50%'}}>
                                                      <Image source={data.image} style={{flex:1,width:undefined,height:undefined,resizeMode:'center'}}/>
                                                  </View>
                                              </View>
                                              <View style={{backgroundColor:'#0078a3',width:'100%',height:'20%',justifyContent:'center',alignItems:'center',borderBottomLeftRadius:10,borderBottomRightRadius:10}}>
                                                  <Text style={{fontSize:14,color:'#FFF',}}>{data.data}</Text>
                                              </View>
                            </View>
                            
                          )
                        }
                        
                      
                      })
                    }
                </View>
            </ScrollView>
        
        
        
        
      </View>
    );
  }
}




const styles=StyleSheet.create({
  mainContainer:{
    flex:1,
    backgroundColor:'#EEE'
  }
})





function mapStateToProps(state){
  return{
    mainCategoryIndex:state.mainCategoryIndex,
    mainSearchKey:state.mainSearchKey
  }
}
function mapDispatchToProps(dispatch){
  return{
    setMainSearchKey:(value)=>dispatch({type:'SET_MAIN_SEARCH_KEY',value}),
      
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(MainCategoryScreen);