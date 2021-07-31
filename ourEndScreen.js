import React, { Component } from 'react';
import { View, Text,StyleSheet,TouchableOpacity,Image,Animated,Dimensions,Linking,ToastAndroid} from 'react-native';
import {connect} from 'react-redux';
import MapView from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import ImageView from 'react-native-image-view';


import Geocoder from 'react-native-geocoding';
import { getDistance, getPreciseDistance } from 'geolib';
import call from 'react-native-phone-call';



import MapViewDirections from 'react-native-maps-directions';
import {Card,Tabs,Tab, Item} from 'native-base'
import { ScrollView } from 'react-native-gesture-handler';



const {width,height}=Dimensions.get('window')
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0290;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;


class ourEndScreenn extends Component {
//   static navigationOptions = {
//     title:'Happy snacks',
//     headerStyle: { backgroundColor: '#b68250'},
//     headerTitleStyle: { color: '#FFF',fontSize:16},
//     headerTintColor: 'white',
  
// }
static navigationOptions={header:null}
    state={
        url:'',
        responseData:[],
        routMode:'WALKING',
        currentLocationAddress:'',
        mode:[{"mode":'driving',"image":require('../images/driving.png')},{"mode":'walking',"image":require('../images/walk.png')}],
        modeChossed:0,
        region:{
          latitude:0,
          longitude:0,
          longitudeDelta:0,
          latitudeDelta:0
        },
        markerPosition:{
          latitude:0,
          longitude:0
        },
        markerPosition2:{
          latitude:0,
          longitude:0
        },
        aniWidth:new Animated.Value(1),
        aniHeight:new Animated.Value(1),
        borderWidthValue:new Animated.Value(5),
        distance:'',
        photoClicked:false,
        photoClickedIndex:0,
        photos:[],
    }


    componentDidMount(){
     
      this.getlocation()

      }

changePhoto(value){
  this.setState({
    photoClicked:true,
    photoClickedIndex:value
  })
}


async  getlocation(){
// console.warn('im location')

let photoArr=[]


console.warn(this.props.searchedPlaceData)
    await Geolocation.getCurrentPosition(info => {
        // console.warn(info)    
        lat=info.coords.latitude;
        lng=info.coords.longitude;
        var region={
        latitude:info.coords.latitude,
        longitude:info.coords.longitude,
        longitudeDelta:LATITUDE_DELTA,
        latitudeDelta:LONGITUDE_DELTA
        }  
        var markerPosition={
        latitude:info.coords.latitude,
        longitude:info.coords.longitude
        }
        this.setState({
        region:region,
        markerPosition:markerPosition
        })
       
        
        var markerPosition2={
        latitude:parseFloat(this.props.searchedPlaceData.lat),
        longitude:parseFloat(this.props.searchedPlaceData.long)
        }
        

        this.setState({
        markerPosition2:markerPosition2
        })
        Geocoder.init("AIzaSyDcjnEF0OMP2a5UIqJol_WPtz2GgyTvH24")
        Geocoder.from(info.coords.latitude,info.coords.longitude)
        .then(json => {
            console.warn(json.results[0].formatted_address)
            this.setState({
              currentLocationAddress:json.results[0].address_components[1].short_name
            })
        })
        .catch(error => console.warn(error));
        var dis = getDistance(
              
          { latitude:info.coords.latitude,longitude: info.coords.longitude},
          { latitude: this.props.searchedPlaceData.lat,longitude:this.props.searchedPlaceData.long}
        )
        this.setState({
          distance:dis/1000
        })
    }
    , (error) => {
      console.warn(error.message)
     
      if(error.message==='No location provider available.')
      {
        ToastAndroid.show('please enable your location' , ToastAndroid.SHORT);
        this.setState({
          networkFailed:true
        })
      }
      else if(error.message=="Network request failed"){
        console.warn(error)
        ToastAndroid.show('please check your network connection' , ToastAndroid.SHORT);
        this.setState({
          networkFailed:true
        })
      }
      else{
        ToastAndroid.show('something went wrong' , ToastAndroid.SHORT);
        this.setState({
          networkFailed:true
        })
      }
      }, {
        enableHighAccuracy: false, timeout: 20000, maximumAge: 1000
      });
   
    this.props.searchedPlaceData.photos.map((item,index)=>{
      let photo={
        source: {
          uri: this.props.searchedPlaceData.image_prepath+item,
          width:0,
          height:0
      }
      }
      photoArr.push(photo)
    })
 await  this.setState({
     photos:photoArr
   })

   console.warn(this.state.photos)
    this.doFade()             
}
     

doFade = () => {
  
  Animated.timing(this.state.aniHeight).stop()
  Animated.timing(this.state.aniWidth).stop()
  Animated.timing(this.state.borderWidthValue).stop()
    this.state.borderWidthValue.setValue(5)
    this.state.aniHeight.setValue(1)
    this.state.aniWidth.setValue(1)
    
    // console.warn(this.state.aniHeight,this.state.aniWidth,this.state.borderWidthValue)
    Animated.parallel([
      Animated.timing(this.state.aniWidth, {
        toValue:20,
        duration: 1500,
      }).start(),
      Animated.timing(this.state.aniHeight, {
        toValue:8,
        duration: 1500,
      }).start(),
      Animated.timing(this.state.borderWidthValue, {
        toValue:0,
        duration: 1500,
      }).start(()=>{this.doFade()})
    ])
  };

 

  



  star(rating){
    let star= []
    let halfStar=false
  
  if(rating!==0){
  
    for (let i = 0; i < 5; i++) {
      if(i<parseInt(rating))
      {
        star.push(
          <View style={{marginBottom:7}}>
            <Image source={require('../images/fullStar.png')} style={{width:10,height:10,marginRight:2}}/>
          </View>
        )
        halfStar=true
      }
     else if(i==parseInt(rating)&&halfStar==true){
      star.push(
        <View style={{marginBottom:7}}>
          <Image source={require('../images/halfStar.png')} style={{width:10,height:10,marginRight:2}}/>
        </View>
      )
     }
     else{
      star.push(
        <View style={{marginBottom:7}}>
          <Image source={require('../images/emptyStar.png')} style={{width:10,height:10,marginRight:2}}/>
        </View>
      )
     }
     
    }
    return star
  }
  else{
    return null
  }
      
      
  }
  
  
 async changeRouteMode(modeValue){
   
    if(modeValue==0){
      await this.setState({
        modeChossed:modeValue
      })
      await this.props.setRouteMode('DRIVING')         
    }
    else{
      await this.setState({
        modeChossed:modeValue
      })
    await this.props.setRouteMode('WALKING')
    }
   console.warn(this.state.mode)
   console.warn(this.props.routeMode)
 
  }
  

  componentDidUpdate(prevProps){
    
    if(prevProps.routeMode!==this.props.routeMode)
    {
      this.getlocation()

    }
  }


setImage(){
  return(
    this.props.searchedPlaceData.photos.map((item,index)=>{
      <Image/>

    })
  )
}

  render() {
    return (
        <View style={styles.mainContainer}>
            <View style={{width:'100%',backgroundColor:'#b68250'}}>
                <View style={{flexDirection:'row',justifyContent:'space-between',margin:10}}> 
                    <TouchableOpacity onPress={()=>{this.props.navigation.navigate('ExactKeyScreen')}}>    
                      <Image source={require('../images/back_arrow.png')} style={{width:22,height:22}}/>            
                    </TouchableOpacity>
                    <View style={{width:'90%'}}>
                    <Text style={{color:'#FFF',fontSize:16,marginBottom:7,fontWeight:'bold'}}>{this.props.searchedPlaceData.shop_name}</Text> 
                    </View>
                    
                </View>
            </View>
            
            <View style={{width:'100%',height:'90%',backgroundColor:'#b68250'}}>
                     <Tabs tabBarUnderlineStyle={{ backgroundColor: "#eec79c",justifyContent:'center',alignItems:'flex-start' }}  >
                        <Tab tabStyle={{backgroundColor: '#b68250'}}
                            textStyle={{color: '#FFF',}}
                            activeTabStyle={{backgroundColor:'#b68250'}}
                            activeTextStyle={{color: '#FFF', fontWeight: 'normal',fontSize:15}}
                            height={50}
                        heading="Direction">
                                <View style={{paddingHorizontal:10,paddingVertical:10 ,backgroundColor:'#b68250'}}>
                                    <View style={{flexDirection:'row',marginBottom:4}}>
                                        <View  style={{width:'10%',justifyContent:'center',alignItems:'flex-start'}}>
                                            <Image source={require('../images/yourlocation.png')} style={{width:20,height:20}}/>                          
                                        </View>
                                        <View style={{width:'85%',borderBottomColor:'#cf965f',borderBottomWidth:1,justifyContent:'flex-end',alignItems:'flex-start'}}>
                                                <Text style={{color:'#FFF',fontSize:12,marginBottom:5}}>{this.state.currentLocationAddress}</Text>
                                        </View>
                                    </View>

                                    <View style={{width:'6%',justifyContent:'center',alignItems:'center',marginBottom:4}}>
                                        <View style={{borderRightColor:'#FFF',borderRightWidth:1,height:20,borderStyle:'dashed',width:'10%'}}/>
                                    </View>
                                    
                                    <View style={{flexDirection:'row'}}>
                                        <View  style={{width:'10%',justifyContent:'center',alignItems:'flex-start'}}>
                                            <Image source={require('../images/location.png')} style={{width:20,height:20}}/>                          
                                        </View>
                                        <View style={{width:'85%',borderBottomColor:'#cf965f',borderBottomWidth:1,justifyContent:'flex-end',alignItems:'flex-start'}}>
                                            <View style={{marginBottom:5}} >                                     
                                            <Text style={{color:'#FFF',fontSize:12}}>{this.props.searchedPlaceData.shop_address}</Text>                                            
                                        </View>
                                        </View>
                                    </View>
                                </View>


                                        
                                        <View style={{justifyContent:'center',alignItems:'center',backgroundColor:'#b68250'}}>
                                            
                                        <View style={{width:'85%',flexDirection:'row',margin:10,justifyContent:'space-evenly'}}>
                                                {
                                                    this.state.mode.map((data,index)=>{
                                                    
                                                    return(
                                                        <View style={{width:'50%'}}>
                                                        {
                                                            index==this.state.modeChossed?
                                                            <TouchableOpacity style={{width:'100%',flexDirection:'row'}} onPress={()=>{this.changeRouteMode(index)}}>
                                                                    <View style={{width:25,height:25}}>
                        
                                                                    <Image source={data.image} style={{flex:1,height:undefined,width:undefined,resizeMode:'center'}}/>
                                                                    </View>
                        
                                                                    <View>
                                                        <Text style={{color:'#FFF',fontSize:12,marginLeft:10,marginTop:5}}>{data.mode}</Text>
                                                                    </View>
                                                        </TouchableOpacity>:
                                                        <View style={{width:'100%'}}>
                                                            <TouchableOpacity style={{width:'90%',height:30,backgroundColor:'rgba(182, 130, 80,0.6)',zIndex:1,position:'absolute'}} onPress={()=>{this.changeRouteMode(index)}}/>
                                                            <TouchableOpacity style={{flexDirection:'row'}} onPress={()=>{this.changeRouteMode(index)}}>
                                                                    <View style={{width:25,height:25}}>

                                                                    <Image source={data.image} style={{flex:1,height:undefined,width:undefined,resizeMode:'center'}}/>
                                                                    </View>

                                                                    <View>
                                                        <Text style={{color:'#FFF',fontSize:12,marginLeft:10,marginTop:5}}>{data.mode}</Text>
                                                                    </View>
                                                        </TouchableOpacity>
                                                        
                                                        </View>
                                                        
                                                        }
                                                        </View>
                                                    )
                                                    
                                                    })
                                                }
                                            
                                            </View>
                                        
                                        </View>
                                        
                                        
                                    
                                    
                                            

                                            
                                        
                                        


                                    
                                    
                                    
                                    

                                    
                                    <MapView
                                    style={{width:'100%',height:height/2}}
                                    region={this.state.region}
                                    showsCompass={true}
                                    >
                                        {
                                            <MapView.Marker  coordinate={this.state.markerPosition} >
                                                <View style={{width:60,height:60,}}>
                                                        <View style={{width:'100%',height:'100%',justifyContent:'flex-end',alignItems:'center',zIndex:1}}>
                                                        <View style={{width:'50%',height:'50%'}}>
                                                            <Image source={require('../images/currentLocation.png')} style={{flex:1,width:undefined,height:undefined,resizeMode:'center'}} />
                                                            </View>
                                                        </View>
                                                            <View style={{justifyContent:'flex-end',alignItems:'center'}}>
                                                            <Animated.View style={{width:this.state.aniWidth,height:this.state.aniHeight,borderColor:'#825c49',borderWidth:this.state.borderWidthValue,borderRadius:50,position:'absolute',zIndex:0}}/>
                                                            </View>
                                                            
                                    
                                                            
                                                            
                                                        
                                                        </View>         
                                            </MapView.Marker> 
                                    }

                                        {
                                                    <MapView.Marker
                                                    coordinate={this.state.markerPosition2} 
                                                    >
                                                    
                                                    
                                                        <View style={{width:40,height:40}}>
                                                            <View style={{width:'80%',height:'80%'}}>
                                                            <Image source={require('../images/destination.png')} style={{flex:1,width:undefined,height:undefined,resizeMode:'center'}} />
                                                                </View>
                                                        
                                                        </View>
                                                    

                                                </MapView.Marker>
                                                
                                        }

                                            {    
                                            <MapViewDirections
                                                origin={this.state.markerPosition}
                                                destination={this.state.markerPosition2}
                                                apikey={'AIzaSyDcjnEF0OMP2a5UIqJol_WPtz2GgyTvH24'}
                                                strokeWidth={5}
                                                mode={this.props.routeMode}
                                                
                                                strokeColor="#eec79c"
                                            />
                                                }

                                    </MapView>
                                    
                                </Tab>
                                <Tab tabStyle={{backgroundColor: '#b68250'}}
                                  textStyle={{color: '#FFF',}}
                                  activeTabStyle={{backgroundColor:'#b68250'}}
                                  activeTextStyle={{color: '#FFF', fontWeight: 'normal',fontSize:15}}
                                  heading="Details">
                                    <View style={{width:'100%',paddingVertical:10}}>
                                      <View style={{flexDirection:'row',marginBottom:10}}>
                                                <View style={{width:'20%',height:40}}>
                                                  <Image source={require('../images/addressRound.png')} style={{flex:1,width:undefined,height:undefined,resizeMode:'center'}}/>
                                                </View>
                                                <View style={{justifyContent:'center',borderBottomColor:'#eec79c',borderBottomWidth:1,width:'75%'}}>
                                              <Text>{this.props.searchedPlaceData.shop_address}</Text>
                                                </View>
                                      </View>
                                      <View style={{flexDirection:'row',marginBottom:10}}>
                                                <View style={{width:'20%',height:40}}>
                                                  <Image source={require('../images/distanceRound.png')} style={{flex:1,width:undefined,height:undefined,resizeMode:'center'}}/>
                                                </View>
                                                <View style={{justifyContent:'center',borderBottomColor:'#eec79c',borderBottomWidth:1,width:'75%'}}>
                                              <Text>{this.state.distance} km</Text>
                                                </View>
                                      </View>
                                      
                                      {
                                        this.props.searchedPlaceData.contact_number!==null?
                                        <TouchableOpacity style={{flexDirection:'row',marginBottom:10}} onPress={()=>{
                                          console.warn('phone call')
                                          const args = {
                                            number: this.props.searchedPlaceData.contact_number, // String value with the number to call
                                            prompt: false // Optional boolean property. Determines if the user should be prompt prior to the call 
                                          }
                                          call(args).catch(console.error)
                                      }}>
                                                <View style={{width:'20%',height:40}}>
                                                  <Image source={require('../images/callRound.png')} style={{flex:1,width:undefined,height:undefined,resizeMode:'center'}}/>
                                                </View>
                                                <View style={{justifyContent:'center',borderBottomColor:'#eec79c',borderBottomWidth:1,width:'75%'}}>
                                              <Text>{this.props.searchedPlaceData.contact_number}</Text>
                                                </View>
                                      </TouchableOpacity>:null
                                      }
                                      
                                      {
                                        this.props.searchedPlaceData.website!==null?
                                        <TouchableOpacity style={{flexDirection:'row',marginBottom:10}} onPress={()=>{
                                          Linking.canOpenURL(this.props.searchedPlaceData.website)
                                          .then((supported) => {
                                            if (!supported) {
                                              ToastAndroid.show('Ooops can\'t open the website' , ToastAndroid.SHORT);
                                            } else {
                                              return Linking.openURL(this.props.searchedPlaceData.website);
                                            }
                                          })
                                          .catch((err) => console.warn('An error occurred', err));
                                          
                                        }}>
                                                  <View style={{width:'20%',height:40}}>
                                                    <Image source={require('../images/websiteRound.png')} style={{flex:1,width:undefined,height:undefined,resizeMode:'center'}}/>
                                                  </View>
                                                  <View style={{justifyContent:'center',borderBottomColor:'#eec79c',borderBottomWidth:1,width:'75%'}}>
                                                <Text>{this.props.searchedPlaceData.website}</Text>
                                                  </View>
                                        </TouchableOpacity>:null
                                      }
                                      
                                    </View>

                                    
                                </Tab>

                                <Tab tabStyle={{backgroundColor: '#b68250'}}
                                  textStyle={{color: '#FFF',}}
                                  activeTabStyle={{backgroundColor:'#b68250'}}
                                  activeTextStyle={{color: '#FFF', fontWeight: 'normal',fontSize:15}}
                                  height={50}
                                   heading="Photos">
                                     <ScrollView>
                                     {
                                       this.props.searchedPlaceData.photos.length==0?
                                       <View style={{width:'100%',height:'85%',justifyContent:'center',alignItems:'center'}}>
                                          <View style={{width:'50%',height:200}}>
                                              <Image source={require('../images/imageUnavailable.png')} style={{flex:1,width:undefined,height:undefined,resizeMode:'center'}}/>
                                          </View>
                                       </View>:
                                       <View style={{width:'100%',justifyContent:'center',alignItems:'center'}}>
                                          <View style={{width:'98%',flexDirection:'row',flexWrap:'wrap',justifyContent:'space-evenly',marginTop:10}}>
                                          {
                                            this.props.searchedPlaceData.photos.map((item,index)=>{
                                              return(
                                               <TouchableOpacity style={[{width:'45%'},{height:150},{backgroundColor:'#fff',marginTop:5,borderColor:'#9e9b9b',borderWidth:1,marginBottom:10}]} onPress={()=>{this.changePhoto(index)}}>
                                                   <View style={{width:'100%',height:'100%'}}>
                                                       <Image loadingIndicatorSource={require('../images/fullStar.png')} source={{uri:this.props.searchedPlaceData.image_prepath+item}} style={{width:'100%',height:'100%'}}/>
                                                   </View>
                                               </TouchableOpacity>
                                              )
                                             
                                            })
                                          }
                                             
                                        </View>
                                        </View>
                                         
                                     }
                                     </ScrollView>

                                     
{
  this.state.photoClicked==true?
  <ImageView
  images={this.state.photos}
  imageIndex={this.state.photoClickedIndex}
  isVisible={this.state.photoClicked}
  onImageChange={(value)=>{
    this.changePhoto(value)
  }}
  onClose={()=>{
    this.setState({
      photoClicked:false
    })
  }}

  
/>
:null
}
           {/* {
             this.state.photoClicked==true?<ViewPager style={{width:'100%',height:'100%'}}>
               {
                 this.state.photos.map((item,index)=>{
                   
                   return(
                   <View style={{width:'100%',height:'100%',justifyContent:'center',alignItems:'center'}} key={index}>
                     <View style={{width:'50%',height:200}}>
                      <Image source={{uri:item.source.uri}} style={{flex:1,width:undefined,height:undefined,resizeMode:'contain'}}/>
                       </View>

                     </View>
                   )

                 })
               }

               </ViewPager>:<View/>
           }                        
                                     */}
                                </Tab>
        </Tabs>
            </View>

               
                
               
            
           
           
      </View>
    
    );
  }
}


const styles=StyleSheet.create({
    mainContainer:{
      flex:1,
      backgroundColor:'#EDEDED'
    }
  })


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
  
  export default connect(mapStateToProps,mapDispatchToProps)(ourEndScreenn);