import React, { Component } from 'react';
import { View, Text,TouchableOpacity,StyleSheet,Dimensions,ScrollView,Image} from 'react-native';
import {connect} from 'react-redux';

const {width,height}=Dimensions.get('window')

class HomeScreen extends Component {
  static navigationOptions={header:null}
 state = {
  
  searchPlaceMainCategory:[{'image':require('../images/HomeScreenImages/classroom.png'),'data':'Education'},{'image':require('../images/HomeScreenImages/lasagna.png'),'data':'Food'},{'image':require('../images/HomeScreenImages/laugh.png'),'data':'Fun'},{'image':require('../images/HomeScreenImages/doctor.png'),'data':'Health'},{'image':require('../images/HomeScreenImages/store.png'),'data':'store'},{'image':require('../images/HomeScreenImages/doorman.png'),'data':'Service'},{'image':require('../images/HomeScreenImages/medal.png'),'data':'Sports'},{'image':require('../images/HomeScreenImages/destination.png'),'data':'Travel'},{'image':require('../images/HomeScreenImages/place.png'),'data':'Others'}],
    searchPlaces:['accounting','airport','amusement_park','aquarium','art_gallery','atm','bakery','bank','bar','beauty_salon','bicycle_store','book_store'
    ,' bowling_alley','bus_station','cafe','campground','car_dealer','car_rental','car_repair','car_wash','casino','cemetery','church',
     'city_hall','clothing_store','convenience_store','courthouse','dentist','department_store','doctor','drugstore','electrician','electronics_store',
     'embassy','fire_station','florist','funeral_home','furniture_store','gas_station','grocery_or_supermarket','gym','hair_care','hardware_store',
     'hindu_temple','home_goods_store','hospital','insurance_agency','jewelry_store','laundry','lawyer','library','light_rail_station','liquor_store',
     ,'local_government_office','locksmith','lodging','meal_delivery','meal_takeaway','mosque','movie_rental','movie_theater','moving_company',
     'museum','night_club','painter','park','parking','pet_store','pharmacy','physiotherapist','plumber','police','post_office','primary_school'
     ,'real_estate_agency','restaurant','roofing_contractor','rv_park','school','secondary_school','shoe_store','shopping_mall','spa',
     'stadium','storage','store','subway_station','supermarket','synagogue','taxi_stand','tourist_attraction','train_station','transit_station'
     ,'travel_agency','university','veterinary_care','zoo'],

    
    };
  

    componentDidMount(){
      console.warn('hello')
    }

  render() {
    return (
   
        <View styles={styles.container}>
            <View style={{width:'100%',height:'20%',backgroundColor:'#13a4da'}}>
            </View>

            <View style={{marginVertical:20,marginHorizontal:5}}>
                <ScrollView>    
                      <View style={{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-evenly'}}>
                          {
                        this.state.searchPlaceMainCategory.map((data,index)=>{
                          if(data.data=='Food'){
                            return(
                            <TouchableOpacity style={[{width:width/3.3},{height:width/3.2},{borderColor:'#13a4da',borderWidth:1,marginBottom:10,borderRadius:10},]}
                            onPress={()=>{this.props.setMaincategoryIndex(index),console.warn(index),this.props.navigation.navigate('MainCategoryScreen')}}>

                                  <View style={{width:'100%',height:'80%',justifyContent:'center',alignItems:'center'}}>
                                      <View style={{width:'50%',height:'50%'}}>
                                          <Image source={data.image} style={{flex:1,width:undefined,height:undefined,resizeMode:'center'}}/>
                                      </View>
                                     
                                  </View>
                                  <View style={{backgroundColor:'#0078a3',width:'100%',height:'20%',justifyContent:'center',alignItems:'center',borderBottomLeftRadius:10,borderBottomRightRadius:10}}>
                                      <Text style={{fontSize:14,color:'#FFF',}}>{data.data}</Text>
                                  </View>
                            </TouchableOpacity>
                            )

                          }  
                          else{
                          return(
                                <View style={[{width:width/3.3},{height:width/3.2},{borderColor:'#13a4da',borderWidth:1,marginBottom:10,borderRadius:10},]}
                                  onPress={()=>{this.props.setMaincategoryIndex(index),console.warn(index),this.props.navigation.navigate('MainCategoryScreen')}}>

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
          
         
           
        </View>
       
    
       
   
    );
  }
}

const styles = StyleSheet.create({
    container: {
      flex:1,
      }
    
  });


  function mapStateToProps(state){
    return{
      mainCategoryIndex:state.mainCategoryIndex
    }
  }
  function mapDispatchToProps(dispatch){
    return{
        setMaincategoryIndex:(value)=>dispatch({type:'SET_MAINCATEGORY_INDEX',value}),
        
    }
  }
  
  export default connect(mapStateToProps,mapDispatchToProps)(HomeScreen);