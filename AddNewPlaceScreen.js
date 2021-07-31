
import React, { Component } from 'react';
import { View, Text, ScrollView,Image,TouchableOpacity,Dimensions,StyleSheet,ActivityIndicator,RefreshControl,ToastAndroid,Modal,Linking,BackHandler,PermissionsAndroid,AsyncStorage} from 'react-native';
import {Input,Form,Item,Label,Textarea,Icon,Picker} from 'native-base';
import MapView from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import ImagePicker from 'react-native-image-crop-picker';
// import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {connect} from 'react-redux';
import NetInfo from '@react-native-community/netinfo';

const {width,height}=Dimensions.get('window')
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0009;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const data = new FormData()
class AddNewPlaceScreen extends Component {

      static navigationOptions = {
        title:'Add a place',
        headerStyle: { backgroundColor: '#b68250'},
        headerTitleStyle: { color: '#FFF',fontSize:16},
        headerTintColor: 'white',
    }

  constructor(props) {
    super(props);
   this.state = {
      streetno:'',
      route:'',
      admin_area_1:'',
      admin_area_2:'',
      loading:false,
      address:'',
      photos:[],
      currentLocationAddress:'',
      shopName:'',
      shopContactNumber:'',
      shopWesite:'',
      shopNameError:false,
      shopAddressError:false,
      shopLatLanError:false,
      shopHourError:false,
      contactNumberError:false,
      region:{
        latitude:0,
        longitude:0,
        longitudeDelta:LONGITUDE_DELTA,
        latitudeDelta:LATITUDE_DELTA        
      },
      validURL:true,
      submitData:false,
      dataGet:false,
      opening_hours:[],
      permissionallowed:false,
      permissionallowedStorage:false,
      refreshing:false,
      EventAdd:false
      


   };
  }

  componentDidMount(){
    
    this.getlocation()
  }


  


  async requestFileAccessPermission(){
    
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE)
      console.warn(granted)
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.warn("accepted")    
       this.setState({
         permissionallowedStorage:false
       })
        this.addPhotos()
      }
      else if(granted=="never_ask_again"){
        
        await AsyncStorage.setItem('storagePermission','true') 
        await AsyncStorage.getItem('storagePermission').then((value) => {
          this.setState({permissionallowedStorage:JSON.parse(value)})
          console.warn('modal '+this.state.permissionallowedStorage)
        })
     
    }  
    
  }




  async opensetting(){
    this.requestFileAccessPermission()
    await Linking.openSettings()
    
  }

  exitapp(){
    BackHandler.exitApp()
    return true;
  }




async  getlocation(){
  console.warn('hi')
  this.props.setLatitude(0),
  this.props.setLongitude(0)

await Geolocation.getCurrentPosition(info => {
    
    var region={
      latitude:info.coords.latitude,
      longitude:info.coords.longitude,
      longitudeDelta:LONGITUDE_DELTA,
      latitudeDelta:LATITUDE_DELTA        
    }
// this.props.setLatitude(info.coords.latitude)
// this.props.setLongitude(info.coords.longitude)
this.props.setRegion(region)
var markerPosition={
  latitude:this.props.region.latitude,
  longitude:this.props.region.longitude
  }
    console.log("Marker" + markerPosition.latitude,markerPosition.longitude)
    
    
    this.setState({
      region:region,
      markerPosition:markerPosition
    }
    )

    console.log("props"+ this.props.latitude,this.props.longitude)

    Geocoder.init("AIzaSyDcjnEF0OMP2a5UIqJol_WPtz2GgyTvH24")
    Geocoder.from(info.coords.latitude,info.coords.longitude)
    .then(json => {
        this.props.setaddress(json.results[0].address_components[0].short_name+' , '+json.results[0].address_components[1].short_name+' , '+json.results[0].address_components[2].short_name+' , '+json.results[0].address_components[4].short_name)
    })
    .catch(error => {
      console.warn(error)
      if(error.message=="Error while fetching. Check your network."){
        console.warn(error)
        ToastAndroid.show('please check your network connection' , ToastAndroid.SHORT);
        this.setState({
          networkFailed:true
        })
      }
    }
   
    );
this.setState({
  dataGet:true,
  refreshing:false
})

}, (error) => {
  console.warn(error.message)
 this.setState({
   refreshing:false
 })
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
    enableHighAccuracy: false, timeout: 40000, maximumAge: 1000
  }
  );    
 
console.warn(this.props.opening_hours)
}


async addPhotos(){
  await ImagePicker.openPicker({
              multiple: true,
              avoidEmptySpaceAroundImage: true
              })
              .then(images => {
                                console.warn(images)
                                this.setState({photos:images})
                                this.state.photos.map((item,index)=>{
                                
                                ImageResizer.createResizedImage(item.path, 260, 260,'PNG', 100)
                                .then((response) => {
                                //console.warn(response)
                                //this.setState({resizedImageUri: response.uri});
                                const newarray=[...this.state.photos]
                                newarray[index].path=response.uri
                                newarray[index].size=response.size
                                newarray[index].height=response.height
                                newarray[index].width=response.width
                                this.setState({photos:newarray})
                                console.warn(this.state.photos)
                                })
                                })
                                });
  }



changeShopname(value) 
{
    this.setState({shopName:value})    
}

changeContactNumber(value)
{   
        this.setState({shopContactNumber:value})   
}

changeShopAddress(value)
{
    this.props.setaddress(value)
}

changeWebsite(value){
    this.setState({shopWesite:value})
}




async doSubmit()
{
    let numReg=/^[0-9]+$/;
    
    this.setState({
      submitData:true
    })

    if (this.state.shopWesite!=='')
    {
     
   await  Linking.canOpenURL(this.state.shopWesite)
     .then((supported) => {
       if (!supported)
        {
             ToastAndroid.show('Ooops can\'t open the website' , ToastAndroid.SHORT);
           this.setState({
               validURL:false,
               submitData:false
             })
             console.warn(this.state.validURL)
        } 
        else {
         
         this.setState({
           validURL:true
         })
       }
     })
     
   }
   else{
    await this.setState({
       validURL:true
     })
   }
    
   

            if(this.state.shopName!==''&&this.state.shopName!==null)
            {
              // console.warn('hi name')
              this.setState({shopNameError:false})
            }
            else{
              this.setState({shopNameError:true,
              submitData:false})
            }

          if(this.props.address!==''&&this.props.address!==null)
            {
              // console.warn('hi address')
              this.setState({shopAddressError:false})
            }
            else{
              this.setState({shopAddressError:true,
                submitData:false})
          }

          if(this.props.latitude!==0&&this.props.longitude!==0)
          {
            console.warn('hi lat lan')
            console.warn(this.props.latitude,this.props.longitude)
            this.setState({
              shopLatLanError:false
            })
          }
          else{
            
            this.setState({
            shopLatLanError:true,
            submitData:false
            })
          }

            

          if(this.props.HourSelected==true)
          { 
            // console.warn('hi hours')
            this.setState({
              shopHourError:false
            })
          }
          else{
            this.setState({
              shopHourError:true,
              submitData:false
            })
          }
        if(this.state.shopContactNumber!==''){
          // console.warn('hi num')
          if(numReg.test(this.state.shopContactNumber)===true)
          {
            this.setState({
              contactNumberError:false
            })
            if((this.state.shopName!==''&&this.state.shopName!==null)&&(this.props.address!==''&&this.props.address!==null)&&(this.props.latitude!==0&&this.props.latitude!==null)&&(this.props.longitude!==0&&this.props.longitude!==null)&&this.props.HourSelected==true&&this.state.validURL==true)
            {
              
                this.postData()
                           
            }
            
          }
          else{
          
            this.setState({
              contactNumberError:true,
              submitData:false,
              
            })
          }

        }
        else
        {
          // console.warn('hi num no')
          if((this.state.shopName!==''&&this.state.shopName!==null)&&(this.props.address!==''&&this.props.address!==null)&&(this.props.latitude!==0&&this.props.latitude!==null)&&(this.props.longitude!==0&&this.props.longitude!==null)&&this.props.HourSelected==true&&(this.state.validURL==true))
          {
            console.warn('i called')
           
                this.postData()
              
          }
          this.setState({
            contactNumberError:false,           
          })
          
        }
          
    
}




async postData(){
  console.warn('im post')

 
 
    this.setState({
      submitData:true
    })
     
     data.append("shop_name",this.state.shopName)
     data.append("lat",this.props.latitude)
     data.append("long",this.props.longitude)
     data.append("shop_address",this.props.address)
     data.append("contact_number",this.state.shopContactNumber)
     data.append("website",this.state.shopWesite)
     data.append("opening_hours",JSON.stringify(this.props.opening_hours))
   
   
     this.state.photos.map((item,index)=>{
       let file = { uri: item.path, type: item.mime, name: item.fileName || `filename${index}.jpg` }
       data.append("images[]",file)
     })
     
     console.warn(JSON.stringify(data))
     
    this.finalPost()
  
          
      }


      async finalPost(){
        console.warn('im final post')
        await fetch("http://selvisoftware.com/sst7/teakadai/public/api/shops", {
          method: 'POST',
           headers: {
             //'Content-Type':"application/x-www-form-urlencoded",
             'Content-Type':'multipart/form-data'
         },
       body:data
   
        })
          .then((response) => response.json())
          .then((responseJson) => {
            console.warn(responseJson)
            // this.setState({
            //   submitData:false
            // })
            if(responseJson.success==true){
              
              if(this.state.EventAdd==true)
              {
                this.setState({
                  EventAdd:false
                })
                this.eventListen(0)
              }
              
            
              this.props.setCount()
             this.setState({
             shopName:'',
             shopContactNumber:'',
             shopWesite:'',
             submitData:false,
             photos:[]
             })
             this.props.setLatitude(0),
             this.props.setLongitude(0)
             this.props.setOpeningHours([])
             this.props.setHoursIsSelect(false)
             console.warn(this.props.count)
             
             ToastAndroid.show(responseJson.data.msg, ToastAndroid.SHORT);
             
            //  this.props.navigation.navigate('ExactKeyScreen')
            }
            else{
              ToastAndroid.show('check all the fields ', ToastAndroid.SHORT);
              this.setState({
                submitData:false
              })
            }
   
   
          })
          .catch((error)=>{
            console.warn(error)
            this.setState({
              EventAdd:true
            })
           this.eventListen(1)
            ToastAndroid.show('something went wrong ', ToastAndroid.SHORT);
            this.setState({
              submitData:true
            })
          });

          

      }

     

eventListen(value)
{
  
    NetInfo.addEventListener(state => {
      if(this.state.EventAdd==true&&state.isConnected==true){
        this.finalPost()
        console.warn('just Check')
        this.setState({
          EventAdd:false
        })
  
      }
    });
  

  
}


      _onRefresh = () => {
        this.setState({refreshing: true});
        this.getlocation()
        }



  render() {
    return (
      <View style={styles.mainContainer}>
          <View style={{marginLeft:15}}>
        <ScrollView showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh}/>
          }>
             
                <View style={{flexDirection:'row',paddingVertical:10}}> 
                    <View style={{width:'10%',justifyContent:'flex-end',alignItems:'center'}}>
                        <View style={{width:'60%',height:35}}> 
                            <Image source={require('../images/shop.png')} style={{flex:1,width:undefined,height:undefined,resizeMode:'center'}}/>
                        </View>
                        
                    </View>
                  
                    <View style={{marginLeft:10,width:'80%'}}>
                        <Item floatingLabel style={{borderBottomColor:'#d1cfcd',borderBottomWidth:1}} > 
                            <Label style={{fontSize:14}}>Add shop name</Label>
                            <Input value={this.state.shopName} onChangeText={(value)=>{this.changeShopname(value)}} />
                        </Item>
                      
                       
                        
                    </View>
                </View>
                <View>
                       {
                          this.state.shopNameError==true?
                          <Text style={{fontSize:12,color:'red'}}>Please fill the shop name </Text>:null
                        }
                </View>
               
             
                <View style={{flexDirection:'row',paddingVertical:10}}> 
                    <View style={{width:'10%',justifyContent:'center',alignItems:'center',paddingTop:10}}>
                        <View style={{width:'60%',height:35}}> 
                            <Image source={require('../images/pin.png')} style={{flex:1,width:undefined,height:undefined,resizeMode:'center'}}/>
                        </View>
                        
                    </View>
                    <View style={{flexDirection:'row'}}>
                            <Item style={{width:'90%'}}> 
                                <Textarea 
                                 placeholder='Add address'
                                 value={this.props.address} 
                                 onChangeText={(value)=>{this.changeShopAddress(value)}} 
                                 multiline={true}/>
                            </Item>
                    </View>
                </View>
                <View>
                       {
                          this.state.shopAddressError==true?
                          <Text style={{fontSize:12,color:'red'}} >Please fill the shop address </Text>:null
                        }
                </View>
          
             {/* <TouchableOpacity style={{width:'95%',height:120,borderRadius:10,alignSelf:'center',marginVertical:10}}
              onPress={()=>{this.props.navigation.navigate('AddressAutoCompleteScreen')}}>
                <View style={{width:'100%',height:'100%',position:'absolute',zIndex:1,backgroundColor:'rgba(182, 130, 80,0.2)'}}/>
                  {
                    this.state.dataGet==true? <MapView style={{width:'100%',height:'100%',zIndex:0,borderRadius:10}} 
                    region={this.props.region}
                    >
                       <MapView.Marker coordinate={this.state.markerPosition} />
                    </MapView>:<View style={{width:'100%',height:'100%',justifyContent:"center",alignItems:'center'}}>
                                <View style={{marginVertical:10,justifyContent:'center',alignItems:'center'}}>
                                    <ActivityIndicator size='small' color='#FFF'/>
                                </View>
                      </View>
                  }
                 
             </TouchableOpacity> */}
           

            <TouchableOpacity onPress={()=>this.props.navigation.navigate('AddressAutoCompleteScreen')}
             style={{justifyContent:'space-between',flexDirection:'row',marginHorizontal:15,borderBottomWidth:0.5,paddingBottom:8}}>
              {
                this.state.shopLatLanError==true?<Text style={{fontSize:12,color:'red'}}>Locate the shop by marker</Text>:
                <Text style={{fontSize:12,color:'#82827e'}}>Locate the shop by marker</Text>
              }
              <Image source={require('../images/click_arrow.png')} style={{width:15,height:15}}></Image>
            </TouchableOpacity>

           


             <TouchableOpacity  style={{flexDirection:'row',paddingVertical:10}} onPress={()=>this.props.navigation.navigate('OpeningHoursScreen')}> 
                    <View style={{width:'10%',justifyContent:'center',alignItems:'center',paddingTop:10}}>
                        <View style={{width:'60%',height:35}}> 
                            <Image source={require('../images/hours.png')} style={{flex:1,width:undefined,height:undefined,resizeMode:'center'}}/>
                        </View>
                        
                    </View>
                    {
                      this.props.HourSelected==false?
                      <View style={{marginLeft:10,width:'80%',borderBottomColor:'#c4c3c0',borderBottomWidth:1,justifyContent:'center'}} >
                      <Text style={{fontSize:14,color:'#82827e',marginTop:4}}>Hours</Text>
                  </View>: <View style={{marginLeft:10,width:'80%',borderBottomColor:'#c4c3c0',borderBottomWidth:1,justifyContent:'center'}} >
                        <Text style={{fontSize:14,color:'#82827e',marginTop:4}}>Modify the Hours</Text>
                    </View>
                    }
                   
                    
             </TouchableOpacity>

             <View>
                       {
                          this.state.shopHourError==true?
                          <Text style={{fontSize:12,color:'red'}}>Please choose the hours </Text>:null
                        }
                </View>
                <View style={{flexDirection:'row',paddingVertical:10}}> 
                <View style={{width:'10%',justifyContent:'flex-end',alignItems:'center',paddingTop:10}}>
                        <View style={{width:'60%',height:35}}> 
                            <Image source={require('../images/contact.png')} style={{flex:1,width:undefined,height:undefined,resizeMode:'center'}}/>
                        </View>
                        
                    </View>
                  
                  <View style={{marginLeft:10,width:'80%'}}>
                    <Item floatingLabel style={{borderBottomColor:'#d1cfcd',borderBottomWidth:1}} > 
                        <Label style={{fontSize:14}}>Add contact</Label>
                        <Input value={this.state.shopContactNumber}  onChangeText={(value)=>{this.changeContactNumber(value)}}
                        keyboardType='phone-pad'
                        maxLength={10}                                         />
                    </Item>
                  </View> 
                </View>

                <View>
                       {
                          this.state.contactNumberError==true?
                          <Text style={{fontSize:12,color:'red'}}>Numbers only allowed </Text>:null
                        }
                </View>


                <View style={{flexDirection:'row',paddingVertical:10}}> 
                <View style={{width:'10%',justifyContent:'flex-end',alignItems:'center'}}>
                        <View style={{width:'60%',height:35}}> 
                            <Image source={require('../images/internet.png')} style={{flex:1,width:undefined,height:undefined,resizeMode:'center'}}/>
                        </View>
                        
                    </View>
                  
                  <View style={{marginLeft:10,width:'80%'}}>
                    <Item floatingLabel style={{borderBottomColor:'#d1cfcd',borderBottomWidth:1}}> 
                        <Label style={{fontSize:14}}>Add website</Label>
                        <Input value={this.state.shopWesite} onChangeText={(value)=>{this.changeWebsite(value)}} />
                    </Item>
                  </View> 
                </View>
                <View>
                       {
                          this.state.validURL==false?
                          <Text style={{fontSize:12,color:'red'}}>enter the valid url </Text>:null
                        }
                </View>
                
                <View style={{width:'100%',alignItems:'center',justifyContent:'center',paddingVertical:10}}>
                  
                  {
                    this.state.photos.length==0?
                  <View style={{marginLeft:10,width:'80%'}}>
                    <TouchableOpacity onPress={()=>this.requestFileAccessPermission()} style={{width:'100%',flexDirection:'row',borderWidth:1,borderColor:"#d1cfcd",padding:5,justifyContent:'center',alignItems:'center'}}>
                      <Image source={require('../images/camera.png')} style={{width:25,height:25,resizeMode:'contain'}}/>
                      <Text style={{fontSize:14,}}>  Add a photo</Text>
                    </TouchableOpacity>
                    <View style={{marginVertical:10}}>
                    <Text style={{fontSize:11}}>Add photos of this place (for example,photos of a shop front,menu or similar). Photos will be shown publicly under you name.</Text>
                    </View>
                    
                  </View>
                  :
                  <View  style={{justifyContent:'center',alignItems:'center'}}>
                      <View style={{width:'80%',flexDirection:'row',marginVertical:10}}> 
                            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            <TouchableOpacity onPress={()=>this.requestFileAccessPermission()}
                            style={{width:100,height:100,backgroundColor:'#ededed',borderWidth:1,borderColor:'#d1cfcd',justifyContent:'center',alignItems:'center'}}>
                            <Image source={require('../images/camera.png')} style={{width:30,height:30,resizeMode:'contain'}}/>
                            </TouchableOpacity>

                            {
                                this.state.photos.map((data)=>{
                                return(
                                    <View style={{marginHorizontal:5}}>
                                    <Image source={{uri:data.path,
                                    width:data.width, height:data.height, mime:data.mime}} style={{width:100,height:100}}/>
                                    </View>
                                )
                                })
                            }
                            </ScrollView>
                      </View>
                   
                  </View>
                  }
                </View>
             
{
  this.state.submitData==true? <View style={{width:'90%',marginVertical:20,borderRadius:5,alignSelf:'center',justifyContent:'center',alignItems:'center',backgroundColor:'#b68250'}} >
  <View style={{marginVertical:10,justifyContent:'center',alignItems:'center'}}>
      <ActivityIndicator size='small' color='#FFF'/>
  </View>
    
    
  
    
  </View>:
   <TouchableOpacity style={{width:'90%',marginVertical:20,borderRadius:5,alignSelf:'center',justifyContent:'center',alignItems:'center',backgroundColor:'#b68250'}} onPress={()=>{this.doSubmit()}}>
   
     <Text style={{fontSize:17,color:'#FFF',marginVertical:10}}> Submit </Text>
        
   </TouchableOpacity>

}
           
            
        </ScrollView>
        </View>
        <Modal
              animationType="slide"
              transparent={true}
             visible={this.state.permissionallowedStorage}>
              <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'rgba(52,52,52,0.5)'}}>
                  
              <View style={{width:'70%',height:'60%',backgroundColor:'#FFF',padding:10,borderRadius:20}}>
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    
                <View style={{width:'60%',height:'40%'}}>
                    <Image source={require('../images/permissionImage.png')} style={{flex:1,width:undefined,height:undefined,resizeMode:'contain'}}/>
                      </View>
                    
                    <Text style={{fontSize:13,textAlign:'center',paddingHorizontal:10}}>If you want upload the photos, We need access to your storage on your device.Go to setting to enable the storage permission.</Text>
                    <TouchableOpacity onPress={()=>this.opensetting()} style={{width:'80%',paddingVertical:8,borderRadius:7,backgroundColor:'#b68250',justifyContent:'center',alignItems:'center',marginVertical:20}}>
                      <Text style={{fontSize:14,color:'#FFF'}}>OPEN SETTINGS</Text>
                    </TouchableOpacity>
          
                    <TouchableOpacity onPress={()=>this.setState({
                      permissionallowedStorage:false
                    })}>
                      <Text>It's ok</Text>
                    </TouchableOpacity>
                </View>
                </View>
              </View>
            </Modal>
      </View>
    );
  }
 }


function mapStateToProps(state){
  return{
   latitude:state.latitude,
   longitude:state.longitude,
   address:state.address,
   opening_hours:state.opening_hours,
   region:state.region,
  count:state.count,
  HourSelected:state.HourSelected
  }
}
function mapDispatchToProps(dispatch){
  return{
    setLatitude:(value)=>dispatch({type:'Latitude',value}),
    setLongitude:(value)=>dispatch({type:'Longitude',value}),
    setaddress:(value)=>dispatch({type:'setaddress',value}),
    setOpeningHours:(value)=>dispatch({type:'setOpeningHours',value}),
    setRegion:(value)=>dispatch({type:'setRegion',value}),
    setCount:()=>dispatch({type:'countInc'}),
    setHoursIsSelect:(value)=>dispatch({type:'choosedHours',value})
    
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(AddNewPlaceScreen);


 const styles=StyleSheet.create({
     mainContainer:{
         flex:1,
         backgroundColor:'#EEE'
     }
 })
