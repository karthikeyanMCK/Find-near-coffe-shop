import React, { Component } from 'react';
import { View, Text,StyleSheet,Image,TouchableOpacity,ScrollView ,Dimensions,ActivityIndicator,Linking,BackHandler,Modal,PermissionsAndroid,TouchableWithoutFeedback,RefreshControl,ToastAndroid,TextInput,Animated,AsyncStorage} from 'react-native';
import {connect} from 'react-redux';
import Geolocation from '@react-native-community/geolocation';
import { getDistance, getPreciseDistance } from 'geolib';
import NetInfo from '@react-native-community/netinfo';



const {width,height}=Dimensions.get('window')

class ExactKeyScreen extends Component {

    static navigationOptions={header:null}
  state = {
      latitude:0,
      longitude:0,
      mainSearchKey:'',
      url:'',
      responseData:[],
      dataFind:false,
      refreshing:false,
      networkFailed:false,
      text:'',
      arrayholder:[],
      searchClicked:false,
      aniWidth:new Animated.Value(1),
      permissionallowed:false,
      gotPermit:false,
      otherError:''
      
    };
  
    componentDidMount(){
      

     this.requestPermission()
    }

    async requestPermission(){
      

      console.warn(width/1.15,width)
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.warn("accepted")    
          this.setState({
            gotPermit:true
          })
          
          await AsyncStorage.setItem('array','false')
          await AsyncStorage.getItem('array').then((value)=>{
            this.setState({permissionallowed:JSON.parse(value)})
          })

          this.getlocation()
        }
        else if(granted=="denied"){
          this.requestPermission()

        }
        else if(granted=="never_ask_again"){      
          await AsyncStorage.setItem('array','true') 
          await AsyncStorage.getItem('array').then((value) => {
            this.setState({permissionallowed:JSON.parse(value)})
            console.warn(this.state.permissionallowed)
          })
       
      }  
        

        
    }

    async  getlocation(){
        
      NetInfo.fetch().then(state => {
        console.log("Connection type", state.type);
         if(state.isConnected==true){
          let responseData=[];
          let responseData2=[];
          
          
           Geolocation.getCurrentPosition(info => {
          //  console.warn(info)    
           this.setState({
              latitude:info.coords.latitude,
              longitude:info.coords.longitude,
           })
            
           
           let url='http://selvisoftware.com/sst7/teakadai/public/api/shops?lat='+info.coords.latitude+'&long='+info.coords.longitude
                    //'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=1500&type=restaurant&keyword=cruise&key=AIzaSyDcjnEF0OMP2a5UIqJol_WPtz2GgyTvH24'
           
            if(this.state.gotPermit==true){
              fetch(url)
              .then((response)=>response.json())
              .then((responseJson)=>{
                                responseData=responseJson   
                                console.warn(responseData)
                                    responseData.map((item,index)=>{
                                      responseData2=item
                                      
                                      var dis = getDistance(
                                        
                                        { latitude:info.coords.latitude,longitude: info.coords.longitude},
                                        { latitude: item.lat,longitude:item.long}
                                      )
                                      // console.warn(dis)
                                      var timing=(dis/1000)*12
                                      var num=timing
                                      var hours=num /60
                                      var rhours=Math.floor(hours)
                                      var minutes=(hours-rhours)*60
                                      var rminutes=Math.round(minutes)
                                      responseData2.distance=dis/1000;
                                      responseData2.time=timing;
                                      responseData[index]=responseData2
                                      // console.warn(responseData[index])
                                      this.setState({
                                        responseData:responseData,
                                        dataFind:true,
                                        networkFailed:false
                                      })
                                    
                                      })
      
                                      this.setState({
                                        arrayholder:this.state.responseData
                                      })
                                      this.props.setResponseData(this.state.responseData)
                                      
                                      console.warn(this.props.responseData)
                                    
                                    
                                  })
                                  .catch((error)=>{
                                    console.warn(error)
                                    ToastAndroid.show('please check your network connection' , ToastAndroid.SHORT);
                                  this.setState({
                                      networkFailed:true
                                    })
                                  
                                  }) 
  
            }
           
                              
          
          }, (error) => {
            console.warn(error.message)
           
            if(error.message==='No location provider available.')
            {
              ToastAndroid.show('please enable your location' , ToastAndroid.SHORT);
              this.setState({
                networkFailed:true,
                otherError:'please enable your location'
              })
            }
            else if(error.message=="Network request failed"){
              console.warn(error)
              ToastAndroid.show('please check your network connection' , ToastAndroid.SHORT);
              this.setState({
                networkFailed:true,
                otherError:'please check your network connection'
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
            }
            
            ); 
  
          this.setState({
            refreshing:false
          })
          
          
         }
         else{
          this.setState({
            networkFailed:true,
            otherError:'please check your network connection'
          })
          ToastAndroid.show('please check your network connection' , ToastAndroid.SHORT);
         }
      });
      
        
           
        }
    

       async doFade(){
  console.warn('im called')
         
            console.warn(this.state.aniWidth)
            this.state.aniWidth.setValue(1)   
             await Animated.timing(this.state.aniWidth, {
                toValue:width/1.3,
                duration:600,
              }).start()
            console.warn(width)
          };



          async opensetting(){
            this.requestPermission()
            Linking.openSettings()
            
            
          }

          exitapp(){
            BackHandler.exitApp()
            return true;
          }



          componentDidUpdate(prevProps){
            
            if(this.props.count!==prevProps.count)
            {
              
              this.requestPermission()
            }
            
          }
          


        // calcCrow(coords1, coords2)
        // {
        //   console.warn(coords1)
        //   // var R = 6.371; // km
        //   var R = 1000;
        //   var dLat = this.toRad(coords2.latitude-coords1.latitude);
        //   var dLon = this.toRad(coords2.longitude-coords1.longitude);
        //   var lat1 = this.toRad(coords1.latitude);
        //   var lat2 = this.toRad(coords2.latitude);
         
        //   console.warn('dLat '+dLat)
        //   console.warn('dLon '+dLon)
        //   console.warn('lat1 '+lat1)
        //   console.warn('lat2 '+lat2)
        //   var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        //     Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
        //   var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        //   var d = R * c;
        //   console.warn('D '+d)
        //   return d;
        // }
        
        // // Converts numeric degrees to radians
        // toRad(Value)
        // {
        //   console.warn('value  '+Value)
        //     console.warn('Value calc '+Value * Math.PI / 180)
        //     return Value * Math.PI / 180;
            
        // }



        SearchFilterFunction(text) {
          const newData = this.state.responseData.filter(item=> {
            const itemData =item.shop_name.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) >= 0;
          });
          this.setState({arrayholder: newData,text:text});
        }


async gotoPlaceScreen(value){
  await  this.props.setSearchedPlaceData(value)
  // console.warn(this.props.searchedPlaceData.data_from)
console.warn(value.data_from)

  value.data_from=='our_end'?
  this.props.navigation.navigate('OurEndScreen'):this.props.navigation.navigate('SearchedPlaceScreen')
  // this.props.navigation.navigate('OurEndScreen')

}







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


_onRefresh = () => {
  this.setState({refreshing: true,dataFind:false});
  this.getlocation()
  }



  render() {
    return (
      <View style={styles.mainContainer} >
        


        <View style={{width:width,height:height/10,backgroundColor:'#b68250',justifyContent:'center',alignItems:'center'}}>
          <View style={{width:width/1.1,flexDirection:'row',height:'100%'}}>
            <View style={{width:width/1.3,height:'100%',justifyContent:'center'}}>
               {
                 this.state.searchClicked==false?
               <View style={{width:'40%',height:'90%',margin:10}}>
                    <Image source={require('../images/splashIconWhite.png')} style={{flex:1,width:undefined,height:undefined,resizeMode:'contain'}}/>
                </View>:
                <Animated.View style={{width:this.state.aniWidth}}>
                <TextInput
                style={styles.textInputStyle}
                onChangeText={text => this.SearchFilterFunction(text)}
                value={this.state.text}
                underlineColorAndroid="transparent"
                placeholder="Search by shop"
              />
                </Animated.View>
              }
            </View>

            <View style={{width:(width/1.1)-(width/1.3),height:'100%',justifyContent:'center'}}>
                <TouchableOpacity style={{width:'100%',height:'50%'}} onPress={()=>{
                  this.setState({
                    searchClicked:!this.state.searchClicked
                  })
                  this.doFade()
                }}>
                  <Image source={require('../images/searchShop.png')} style={{flex:1,width:undefined,height:undefined,resizeMode:'contain'}}/>
                </TouchableOpacity>

            </View>
          </View>
        </View>
       
       

<View>

{
  this.state.networkFailed==true&&this.state.gotPermit==true?<View style={{width:'100%',height:'90%',justifyContent:'center',alignItems:'center'}}>
    <Text style={{fontSize:15,fontWeight:'bold',marginBottom:10}}>{this.state.otherError}</Text>
    <TouchableOpacity style={{width:'35%',backgroundColor:'#b68250',borderRadius:5,justifyContent:'center',alignItems:'center'}} onPress={()=>{this.setState({refreshing: true,dataFind:false,networkFailed:false}),this.requestPermission()
  this.getlocation()}}>
        <Text style={{color:'#FFF',fontSize:15,marginVertical:8}}>Retry</Text>
      </TouchableOpacity>
    </View>:<View>
    {
    this.state.dataFind==false&&this.state.gotPermit==true?
    <View style={{width:'100%',height:'90%',justifyContent:'center',alignItems:'center'}}>
          <View style={{width:'50%',flexDirection:'row',padding:10,justifyContent:'center',borderColor:'#b68250',borderWidth:1,borderRadius:5}}>
          <ActivityIndicator size='large' color='#b68250'/>
            <Text style={{color:'#b68250',textAlign:'center',marginHorizontal:20,marginTop:10}}>Loading</Text>
          </View>
    </View>:
    <View>
    <View style={{width:'100%',height:'20%',backgroundColor:'#b68250',position:'absolute',zIndex:0}}/>
    <View style={{marginBottom:100}}>
    <ScrollView showsVerticalScrollIndicator={false}
refreshControl={
<RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh}/>
}
>
            <View style={{justifyContent:'center',alignItems:'center'}} >
              <View style={{width:'85%'}}>
                {
                  this.state.dataFind==true?<Text style={{marginBottom:10,color:'#FFF',fontSize:14}}>Shops near you</Text>:null

              }
                  
              </View>
            </View>
            <View style={{justifyContent:'center',alignItems:'center'}}>
                {
                    this.state.arrayholder.map((data,index)=>{
                     
                     
                      return(

                            <TouchableOpacity style={{width:'90%',backgroundColor:'#FFF',borderColor:'#c8a891',borderWidth:1,marginBottom:30,borderRadius:10,justifyContent:'center',padding:10}} 
                            onPress={()=>{this.gotoPlaceScreen(data)}}>
                               
                               <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                                      <Text style={{color:'#8f5a28',fontSize:13,marginBottom:7,fontWeight:'bold'}}>{data.shop_name} </Text>
                                      <View style={{alignItems:'flex-end'}}>
                                      {
                                        data.data_from=='google'?
                                        <Image source={require('../images/fromGoogle.png')} style={{width:15,height:15,resizeMode:'contain'}}></Image>
                                        :
                                        <Image source={require('../images/notk.png')} style={{width:25,height:25,resizeMode:'contain'}}></Image>
                                      }
                                        </View>
                                </View>
                                
                               

                                
                                        

                                <View style={{flexDirection:'row'}}>
                                        {
                                          this.star(data.rating)
                                        }
                                        </View>

                                        <View style={{marginBottom:5}} >                                     
                                              <Text style={{fontSize:12}}>{data.shop_address}</Text>                                            
                                        </View>   

                                        <View>
                                          {
                                            data.opening_hours==undefined?<Text style={{color:'red',fontSize:12}}>Currently Closed</Text>:<View>
                                              {
                                                data.opening_hours==true?<Text style={{color:'green',fontSize:12}}>Currently Open</Text>:<Text style={{color:'red',fontSize:12}}>Currently Closed</Text>
                                              }
                                              </View>
                                          }
                                        </View>
                                      
                                       


                                        <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:10}}>
                                          
                                                <View style={{width:'30%',flexDirection:'row',justifyContent:'center'}}>
                                                      <View style={{width:'55%',height:30}}>
                                                          <Image source={require('../images/walkingImage.png')} style={{flex:1,width:undefined,height:undefined,resizeMode:'contain'}} /> 
                                                      </View>                                    
                                                      <Text style={{color:'#000',fontSize:10,marginTop:10}}>{Math.round(parseFloat(data.time))} min</Text>
                                                </View> 
                                                <View style={{width:'30%',flexDirection:'row',justifyContent:'center'}}>
                                                      <View style={{width:'55%',height:30}}>
                                                          <Image source={require('../images/distance.png')} style={{flex:1,width:undefined,height:undefined,resizeMode:'contain'}} /> 
                                                      </View>                                    
                                                      <Text style={{color:'#000',marginTop:10,fontSize:10}}>{parseFloat(data.distance).toFixed(2)} km</Text>
                                                </View>                                             

                                                <TouchableOpacity style={{width:'30%',flexDirection:'row',justifyContent:'center'}}
                                                onPress={()=>{this.gotoPlaceScreen(data)}}>
                                                      <View style={{width:'55%',height:30}}>
                                                          <Image source={require('../images/coffeDirection.png')} style={{flex:1,width:undefined,height:undefined,resizeMode:'contain'}} /> 
                                                      </View>   
                                                                                       
                                                      <Text style={{color:'#000',marginTop:10,fontSize:10}}>Direction</Text>
                                                </TouchableOpacity>
                                         

                                        </View>
                                
                                
                            </TouchableOpacity>
                        )
                    })
                    
                }
            </View>
        </ScrollView>
        
        </View>
        
        
        
      </View>
      
  }
  
      </View>
      
}


</View>
<TouchableOpacity style={{alignSelf:'flex-end',position:'absolute',top:height/1.21,marginRight:20}} onPress={()=>{this.props.navigation.navigate('AddNewPlaceScreen')}}>
  <Image source={require('../images/AddNewShop.png')} style={{width:50,height:50,marginRight:20}}/>
</TouchableOpacity>


            <Modal
              animationType="slide"
              transparent={true}
             visible={this.state.permissionallowed}>
              <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'rgba(52,52,52,0.5)'}}>
                  
                <View style={{width:'70%',height:'60%',backgroundColor:'#FFF',padding:10,borderRadius:20}}>
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <View style={{width:'60%',height:'40%'}}>
                    <Image source={require('../images/permissionImage.png')} style={{flex:1,width:undefined,height:undefined,resizeMode:'contain'}}/>
                      </View>
                    
                    <Text style={{fontSize:13,paddingHorizontal:10,textAlign:'center'}}>If you want access this application, We need access to your location on your device.Go to setting to enable the location permission.</Text>
                    <TouchableOpacity onPress={()=>this.opensetting()} style={{width:'80%',borderRadius:7,paddingVertical:8,backgroundColor:'#b68250',justifyContent:'center',alignItems:'center',marginVertical:20}}>
                      <Text style={{fontSize:14,color:'#FFF'}}>OPEN SETTINGS</Text>
                    </TouchableOpacity>
          
                    <TouchableOpacity onPress={()=>this.exitapp()}>
                      <Text >EXIT APP</Text>
                    </TouchableOpacity>
                </View>
                </View>
              </View>
            </Modal>



      </View>
    );
  }
}

const styles=StyleSheet.create({
    mainContainer:{
        flex:1,
        backgroundColor:'#EEE'
    },
    textInputStyle: {
      height:40,
      width:'100%',
      paddingLeft: 10,
      backgroundColor: '#FFF',
      borderRadius:5,
      marginBottom:5
    },
})




function mapStateToProps(state){
    return{
      mainCategoryIndex:state.mainCategoryIndex,
      mainSearchKey:state.mainSearchKey,
      searchedPlaceData:state.searchedPlaceData,
      responseData:state.responseData,
      count:state.count
      
    }
  }
  function mapDispatchToProps(dispatch){
    return{
        setSearchedPlaceData:(value)=>dispatch({type:'SET_SEARCHED_PLACE_DATA',value}),
        setResponseData:(value)=>dispatch({type:'setReaponseData',value}),
  
    }
  }
  
  export default connect(mapStateToProps,mapDispatchToProps)(ExactKeyScreen);