import React, { Component } from 'react'
import { Text, View,Image ,Dimensions,TouchableOpacity,ToastAndroid} from 'react-native'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import {connect} from 'react-redux'

const {width,height}=Dimensions.get('window')
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0009;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class AddressAutoCompleteScreen extends Component {
      static navigationOptions = {
            title:'Mark location',
            headerStyle: { backgroundColor: '#b68250'},
            headerTitleStyle: { color: '#FFF',fontSize:16},
            headerTintColor: 'white',
        }

      state = {
      initialPosition:{
      latitude:0,
      longitude:0,
      latitudeDelta:0,
      longitudeDelta:0,
      },
      markerPosition:{
      latitude:0,
      longitude:0
      },
      changeMarker:{
      latitude:0,
      longitude:0
      },
      show:false,
      address:'',
      }

componentDidMount(){
                console.disableYellowBox = false;
               this.getlocation()
      }



      async  getlocation(){
            // await Geolocation.getCurrentPosition(info => {
            //     var markerPosition={
            //     latitude:info.coords.latitude,
            //     longitude:info.coords.longitude
            //     }
            //     var region={
            //       latitude:info.coords.latitude,
            //       longitude:info.coords.longitude,
            //       longitudeDelta:LONGITUDE_DELTA,
            //       latitudeDelta:LATITUDE_DELTA        
            //     }
            
            //     console.log("Marker" + markerPosition.latitude,markerPosition.longitude)
                
            //     this.props.setRegion(region)
            //     this.setState({
            //       initialPosition:this.props.region,
            //       markerPosition:markerPosition
            //     }
            //     )
            
            //     console.log("props"+ this.props.latitude,this.props.longitude)
            
            //     Geocoder.init("AIzaSyDcjnEF0OMP2a5UIqJol_WPtz2GgyTvH24")
            //     Geocoder.from(info.coords.latitude,info.coords.longitude)
            //     .then(json => {
            //         this.props.setaddress(json.results[0].address_components[0].short_name+' , '+json.results[0].address_components[1].short_name+' , '+json.results[0].address_components[2].short_name+' , '+json.results[0].address_components[4].short_name)
            //     })
            //     .catch(error => console.warn(error));
            // });    
            var markerPosition={
                      latitude:this.props.region.latitude,
                      longitude:this.props.region.longitude
                      }

                      this.setState({
                              initialPosition:this.props.region,
                              markerPosition:markerPosition
                            })    
            
             
            }






      
async getaddress(address){

            await this.setState({address:address})
            var url="https://maps.googleapis.com/maps/api/place/textsearch/json?query="+this.state.address+"&key=AIzaSyA7WMFKWkvwBnf3DCeMyepx19UW_Mez_Js"
            console.log(url)
            await fetch(url)
            .then((response) => response.json())
            .then((responseJson) => {
            console.warn(responseJson.results[0].geometry.location.lat,responseJson.results[0].geometry.location.lng)

            var changeRegion={
            latitude:responseJson.results[0].geometry.location.lat,
            longitude:responseJson.results[0].geometry.location.lng,
            latitudeDelta:LATITUDE_DELTA,
            longitudeDelta:LONGITUDE_DELTA
            }

            var changeMarkerPosition={
            latitude:responseJson.results[0].geometry.location.lat,
            longitude:responseJson.results[0].geometry.location.lng
            }
            this.props.setLatitude(changeMarkerPosition.latitude)
            this.props.setLongitude(changeMarkerPosition.longitude)

            Geocoder.init("AIzaSyDcjnEF0OMP2a5UIqJol_WPtz2GgyTvH24")
            Geocoder.from(responseJson.results[0].geometry.location.lat,responseJson.results[0].geometry.location.lng)
            .then(json => {
                this.props.setaddress(json.results[0].address_components[0].short_name+' , '+json.results[0].address_components[1].short_name+' , '+json.results[0].address_components[2].short_name+' , '+json.results[0].address_components[4].short_name)
            })
            .catch(error => console.warn(error));
            this.setState({initialPosition:changeRegion,markerPosition:changeMarkerPosition})

            
            }, (error) => {
                  // console.warn('error'+error.message)
                  if(error.message==='No location provider available.')
                  {
                    ToastAndroid.show('please enablel your location' , ToastAndroid.SHORT);
                  }
                  }
                  
                  ); 
 
            
 }

 async onRegionChange(region) {
      console.log(region);
      await this.setState({initialPosition: region});
 }

 async setChangeMarkerPosition(e){
      console.log(e.nativeEvent.coordinate)
     
      await this.setState({initialPosition:{
      latitude:e.nativeEvent.coordinate.latitude,
      longitude:e.nativeEvent.coordinate.longitude,
      latitudeDelta:0.005,
      longitudeDelta:0.002
      },
      markerPosition:e.nativeEvent.coordinate
      })
      await this.props.setRegion(this.state.initialPosition)
      await this.props.setLatitude(this.state.markerPosition.latitude)
      await this.props.setLongitude(this.state.markerPosition.longitude)
      Geocoder.init("AIzaSyDcjnEF0OMP2a5UIqJol_WPtz2GgyTvH24")
            Geocoder.from(this.state.markerPosition.latitude,this.state.markerPosition.longitude)
            .then(json => {
                this.props.setaddress(json.results[0].address_components[0].short_name+' , '+json.results[0].address_components[1].short_name+' , '+json.results[0].address_components[2].short_name+' , '+json.results[0].address_components[4].short_name)
            })
            .catch(error => console.warn(error));
      console.warn(this.props.latitude,this.props.longitude)
      }


async setShopLatLan(){
     await this.props.setLatitude(this.state.markerPosition.latitude)
      await this.props.setLongitude(this.state.markerPosition.longitude)
      await this.setState({
            initialPosition:{
            latitude:this.state.markerPosition.latitude,
            longitude:this.state.markerPosition.longitude,
            latitudeDelta:0.005,
            longitudeDelta:0.002
            }
      })
     await this.props.setRegion(this.state.initialPosition)
     this.props.navigation.navigate('AddNewPlaceScreen')
}

 render() {
 return (
 <View style={{flex:1}}>
      <View style={{width:'100%',zIndex:1,position:'absolute',flexDirection:'row'}}>
            <GooglePlacesAutocomplete
            placeholder='Search'
            minLength={1} // minimum length of text to search
            autoFocus={false}
            returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
            keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
            listViewDisplayed='auto' 
            onPress={(data, details = null) => {this.getaddress(data.description)}} 
            
            query={{key: 'AIzaSyA7WMFKWkvwBnf3DCeMyepx19UW_Mez_Js'}}
            textInputProps={{
            onFocus: () => this.setState({show: true}),
            onBlur: () => this.setState({show: false}),
            onChangeText: (text) => { console.log(text)}}}
            
            listViewDisplayed={this.state.show}
            
            styles={{
            textInputContainer: {
            width: '100%'
            },
            description: {
            fontWeight: 'bold'
            },
            predefinedPlacesDescription: {
            color: '#1faadb'
            },
            listView: {zIndex: 1,backgroundColor:'#FFF',color:'black'}
            }}/>
      </View>

      <View style={{flex:1}}>
          <MapView
          style={{flex:1}}
          region={this.state.initialPosition}
      //     onRegionChangeComplete={(region)=>this.onRegionChange(region)}
          onPress={(e)=>this.setChangeMarkerPosition(e)}>
                <Marker coordinate={this.state.markerPosition}/>

          </MapView>
          
          {/* <TouchableOpacity onPress={()=>{this.setShopLatLan()}}
          style={{position:'absolute',justifyContent:'flex-end',alignItems:'center',alignSelf:'center',backgroundColor:'#0596C5',padding:10,bottom:10,right:10,borderRadius:20}}>
         
                <Image source={require('../images/click_arrow.png')} style={{width:20,height:20,resizeMode:'contain'}}/>
          </TouchableOpacity> */}

          <View style={{width:'100%',position:'absolute',justifyContent:'flex-end',alignItems:'center',alignSelf:'center',bottom:50}}>
                <TouchableOpacity style={{backgroundColor:'#b68250',width:'40%',justifyContent:'center',alignItems:'center',borderRadius:7}}
                onPress={()=>{this.setShopLatLan()}}>
                      <Text style={{fontSize:15,color:'#FFF',marginVertical:5}}>save</Text>
                </TouchableOpacity>
          </View>
      
      </View>
 </View>
 )
 }
}

function mapStateToProps(state){
 return{
 latitude:state.latitude,
 longitude:state.longitude,
 address:state.address,
 region:state.region
 }
}
function mapDispatchToProps(dispatch){
 return{
 setLatitude:(value)=>dispatch({type:'Latitude',value}),
 setLongitude:(value)=>dispatch({type:'Longitude',value}),
 setaddress:(value)=>dispatch({type:'setaddress',value}),
 setRegion:(value)=>dispatch({type:'setRegion',value})
 }
}

export default connect(mapStateToProps,mapDispatchToProps)(AddressAutoCompleteScreen);