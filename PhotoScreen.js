import React, { Component } from 'react'
import { Text, View,Image ,Dimensions,TouchableOpacity} from 'react-native'
import {connect} from 'react-redux';

const {width,height}=Dimensions.get('window')
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0009;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class PhotoScreen extends Component {

  

  static navigationOptions = {
    title:'Photos',
    headerStyle: { backgroundColor: '#b68250'},
    headerTitleStyle: { color: '#FFF',fontSize:16},
    headerTintColor: 'white',
  
}

   
  render() {
    return (
      <View style={{flex:1}}>
      
{/* 
            <View style={{width:'100%',height:'100%',justifyContent:'center',alignItems:'center'}}>
              <View>
              <ViewPager style={{width:'50%',height:'70%'}} >
                    
                    <Image source={require('../images/fullStar.png')} style={{width:'60%',height:250}}/>
                    <Image source={require('../images/halfStar.png')} style={{width:'60%',height:250}}/>
                    <Image source={require('../images/gallery.png')} style={{width:'60%',height:250}}/>
                    
                </ViewPager>
              </View>
                
            
            </View> */}
            
        </View>
    )
  }
}


function mapStateToProps(state){
  return{
    mainCategoryIndex:state.mainCategoryIndex,
    mainSearchKey:state.mainSearchKey,
    searchedPlaceData:state.searchedPlaceData,
    routeMode:state.routeMode
  }
}
function mapDispatchToProps(dispatch){
  return{
      setSearchedPlaceData:(value)=>dispatch({type:'SET_SEARCHED_PLACE_DATA',value}),
      setRouteMode:(value)=>dispatch({type:'SET_ROUTE_MODE',value})
      
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(PhotoScreen);