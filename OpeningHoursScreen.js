import React, { Component } from 'react';
import { View, Text,ScrollView,Picker,StyleSheet,TouchableOpacity,Modal,Dimensions,CheckBox,Image} from 'react-native';
import {Card} from 'native-base';
import {connect} from 'react-redux';
const {width,height}=Dimensions.get('window')


class OpeningHoursScreen extends Component {
    static navigationOptions = {
        title:'Hours',
        headerStyle: { backgroundColor: '#b68250'},
        headerTitleStyle: { color: '#FFF',fontSize:16},
        headerTintColor: 'white',
      
    }


    state = {
        weekDays:[{"day":'Sunday',"choosed":false,"fullDay":false,openingTime:'9.00AM',closingTime:'6.00PM'},{"day":'Monday',"choosed":false,"fullDay":false,openingTime:'9.00AM',closingTime:'6.00PM'},{"day":'Tuesday',"choosed":false,"fullDay":false,openingTime:'9.00AM',closingTime:'6.00PM'},{"day":'Wednesday',"choosed":false,"fullDay":false,openingTime:'9.00AM',closingTime:'6.00PM'},{"day":'Thursday',"choosed":false,"fullDay":false,openingTime:'9.00AM',closingTime:'6.00PM'},{"day":'Friday',"choosed":false,"fullDay":false,openingTime:'9.00AM',closingTime:'6.00PM'},{"day":'Saturday',"choosed":false,"fullDay":false,openingTime:'9.00AM',closingTime:'6.00PM'}],
        choosedWeekDays:[],
        time:12.00,
        openingTime:[],
        closingTime:[],
        openingTimeModal:false,
        closingTimeModal:false,
        dayIndex:0
        
    };
  
        
      componentDidMount(){
          
           this.getTime()
           console.warn(this.props.HourSelected)
        }
        
async getTime(){

    var arr=[];
    var arr2=[];
    var time=12.00;
    var NTime=1.00;
    var timeVariations;
    if(this.props.HourSelected==true){
        console.warn('hi')
        
       await this.setState({
            choosedWeekDays:this.props.opening_hours
        })
        console.warn(this.state.choosedWeekDays)
    }
    for(let i=0;i<=95;i++)
    {
       
if(i>=48){
    arr.push((time.toFixed(2))+' PM')
}
else{
    arr.push((time.toFixed(2))+' AM')  
}
        
        time=time+0.15;
        if(time.toFixed(2)>=12.50)
        {
            NTime=1.00;
            console.warn('im true '+time)
            time=NTime;
        }
        timeVariations=(time.toFixed(2))-(Math.floor(time))
        // console.warn('tofixed 2 '+time.toFixed(2)+', tofixed0  '+Math.floor(time))
        if(timeVariations>=0.50){
            NTime=NTime+1.00
            time=NTime;
        }
       

    }




await this.setState({
openingTime:arr,
closingTime:arr,
})



}
    

    
async setOpeningHours(value){
    console.warn('im called')
    await this.props.setOpeningHours(value)
    await this.props.setHoursIsSelect(true)
    this.props.navigation.navigate('AddNewPlaceScreen')
    console.warn(this.props.opening_hours)


}

  render() {
    return (
      <View style={styles.mainContainer}>

       <ScrollView showsVerticalScrollIndicator={false}>
           {
               this.props.HourSelected==true?
        <View style={{padding:10}}>
            {
                this.state.choosedWeekDays.map((data,index)=>{
                    return(
                        <View style={{width:'100%',borderBottomColor:'#EEE',borderBottomWidth:1,marginBottom:6}}>
                            <View style={{flexDirection:'row',marginVertical:10}}>
                                <View style={{width:'15%',justifyContent:'center',alignItems:'flex-start'}}>
                                    {/* <CheckBox value={data.choosed} onValueChange={()=>{
                                        var arr=this.state.weekDays;
                                        arr[index].choosed=!arr[index].choosed;
                                        this.setState({weekDays:arr,openingTimeModal:false,closingTimeModal:false})
                                    }}/> */}
                                    
                                    {
                                        data.choosed==true?
                                        <TouchableOpacity style={{width:20,height:20}}
                                        onPress={()=>{
                                            
                                            var arr=this.state.choosedWeekDays;
                                            arr[index].choosed=!arr[index].choosed;
                                            this.setState({choosedWeekDays:arr,openingTimeModal:false,closingTimeModal:false})
                                            console.warn(this.props.opening_hours)
                                        }}> 
                                            <Image source={require('../images/check.png')} style={{flex:1,width:undefined,height:undefined,resizeMode:'contain'}}/>
                                        </TouchableOpacity>:
                                        
                                        <TouchableOpacity style={{width:20,height:20}}
                                        onPress={()=>{
                                            console.warn('im touched2 '+this.props.HourSelected)
                                            console.warn(this.props.opening_hours)
                                            var arr=this.state.choosedWeekDays;
                                            arr[index].choosed=!arr[index].choosed;
                                            this.setState({choosedWeekDays:arr,openingTimeModal:false,closingTimeModal:false})
                                            
                                        }}> 
                                            <Image source={require('../images/uncheck.png')} style={{flex:1,width:undefined,height:undefined,resizeMode:'contain'}}/>
                                        </TouchableOpacity>
                                        
           
                                
                                    }
                                    
                                </View>
                                <View style={{width:'80%',justifyContent:'center',alignItems:'flex-start'}}>
                                    <Text>{data.day}</Text>
                                </View>
                            </View>

                            <View >
                                {
                                data.choosed==true?
                                    <View style={{width:'100%',justifyContent:'center',alignItems:'center',margin:10}}>
                                        {
                                            data.fullDay==false?<View style={{width:'68%',flexDirection:'row',justifyContent:'space-between',marginBottom:10}}>
                                                    
                                            <Card style={{width:width/4.5,height:30,justifyContent:'center',alignItems:'center'}}>
                                                    <TouchableOpacity onPress={()=>{
                                                        if(this.state.closingTimeModal==true){
                                                            console.warn('hi')
                                                            this.setState({
                                                                closingTimeModal:!this.state.closingTimeModal,
                                                                openingTimeModal:!this.state.openingTimeModal,
                                                                dayIndex:index
                                                            })
                                                        }
                                                        else{
                                                            this.setState({
                                                                openingTimeModal:!this.state.openingTimeModal,
                                                                dayIndex:index
                                                            })
                                                        }
                                                        
                                                    }}
                                                    style={{flexDirection:'row',padding:5}}>
                                                            <Text style={{fontSize:12,marginRight:5}}>{data.openingTime}</Text>
                                                            <Image source={require('../images/menu.png')} style={{width:8,height:8,top:4}}/>
                                                            
                                                    </TouchableOpacity>
                                            </Card>
                                                                                
                                            <Card style={{width:width/4.5,height:30,justifyContent:'center',alignItems:'center'}}>
                                                <TouchableOpacity onPress={()=>{
                                                    if(this.state.openingTimeModal==true){
                                                        this.setState({
                                                            openingTimeModal:!this.state.openingTimeModal,
                                                            dayIndex:index,
                                                            closingTimeModal:!this.state.closingTimeModal,
                                                        }) 

                                                    }
                                                    else{
                                                        this.setState({
                                                            closingTimeModal:!this.state.closingTimeModal,
                                                            dayIndex:index,
                                                        })

                                                    }
                                                    
                                                }} 
                                                style={{flexDirection:'row',padding:5}}>
                                                        <Text style={{fontSize:12,marginRight:5}}>{data.closingTime}</Text>
                                                        <Image source={require('../images/menu.png')} style={{width:8,height:8,top:4}}/>
                                                </TouchableOpacity>
                                            </Card>
                                                                    
                                </View>:null
                                        }
                                        
                                        <View style={{width:'68%',justifyContent:'flex-start',alignItems:'flex-start',flexDirection:'row'}}>
                                            {
                                                data.fullDay==true?
                                                <TouchableOpacity style={{width:18,height:18,borderRadius:100,borderColor:'#b68250',borderWidth:1,justifyContent:'center',alignItems:'center'}} 
                                                onPress={()=>{
                                                    var arr=this.state.choosedWeekDays;
                                                    arr[index].fullDay=!arr[index].fullDay
                                                    this.setState({
                                                        choosedWeekDays:arr,
                                                    })
                                                    
                                                }}> 
                                                 <View style={{width:9,height:9,backgroundColor:'#b68250',borderRadius:100}}/>                                           
                                               </TouchableOpacity>:

                                               <TouchableOpacity onPress={()=>{
                                                    var arr=this.state.choosedWeekDays;
                                                    arr[index].fullDay=!arr[index].fullDay
                                                    this.setState({
                                                        choosedWeekDays:arr,
                                                        closingTimeModal:false,
                                                        openingTimeModal:false
                                                    })
                                                    console.warn(this.state.closingTimeModal,this.state.openingTimeModal)
                                                }}
                                               style={{width:18,height:18,borderRadius:100,borderColor:'#b68250',borderWidth:1,justifyContent:'center',alignItems:'center'}}/>
                                            }

                                            <Text style={{marginHorizontal:10,fontSize:13,fontWeight:'400'}}>Open 24 Hours</Text>
                                            
                                        </View>


                                    </View>:null
                                 }
                                
                            </View>


                          
                           

                        </View>
                    )
                })
            }
        </View>:
        <View style={{padding:10}}>
            {
                this.state.weekDays.map((data,index)=>{
                    return(
                        <View style={{width:'100%',borderBottomColor:'#EEE',borderBottomWidth:1,marginBottom:6}}>
                            <View style={{flexDirection:'row',marginVertical:10}}>
                                <View style={{width:'15%',justifyContent:'center',alignItems:'flex-start'}}>
                                    {/* <CheckBox value={data.choosed} onValueChange={()=>{
                                        var arr=this.state.weekDays;
                                        arr[index].choosed=!arr[index].choosed;
                                        this.setState({weekDays:arr,openingTimeModal:false,closingTimeModal:false})
                                    }}/> */}
                                    
                                    {
                                        data.choosed==true?
                                        <TouchableOpacity style={{width:20,height:20}}
                                        onPress={()=>{
                                            var arr=this.state.weekDays;
                                            arr[index].choosed=!arr[index].choosed;
                                            this.setState({weekDays:arr,openingTimeModal:false,closingTimeModal:false})
                                        }}> 
                                            <Image source={require('../images/check.png')} style={{flex:1,width:undefined,height:undefined,resizeMode:'contain'}}/>
                                        </TouchableOpacity>:
                                        <TouchableOpacity style={{width:20,height:20}}
                                        onPress={()=>{
                                            var arr=this.state.weekDays;
                                            arr[index].choosed=!arr[index].choosed;
                                            this.setState({weekDays:arr,openingTimeModal:false,closingTimeModal:false})
                                        }}> 
                                            <Image source={require('../images/uncheck.png')} style={{flex:1,width:undefined,height:undefined,resizeMode:'contain'}}/>
                                        </TouchableOpacity>
                                
                                    }
                                    
                                </View>
                                <View style={{width:'80%',justifyContent:'center',alignItems:'flex-start'}}>
                                    <Text>{data.day}</Text>
                                </View>
                            </View>

                            <View >
                                {
                                data.choosed==true?
                                    <View style={{width:'100%',justifyContent:'center',alignItems:'center',margin:10}}>
                                        {
                                            data.fullDay==false?<View style={{width:'68%',flexDirection:'row',justifyContent:'space-between',marginBottom:10}}>
                                                    
                                            <Card style={{width:width/4.5,height:30,justifyContent:'center',alignItems:'center'}}>
                                                    <TouchableOpacity onPress={()=>{
                                                        if(this.state.closingTimeModal==true){
                                                            console.warn('hi')
                                                            this.setState({
                                                                closingTimeModal:!this.state.closingTimeModal,
                                                                openingTimeModal:!this.state.openingTimeModal,
                                                                dayIndex:index
                                                            })
                                                        }
                                                        else{
                                                            this.setState({
                                                                openingTimeModal:!this.state.openingTimeModal,
                                                                dayIndex:index
                                                            })
                                                        }
                                                        
                                                    }}
                                                    style={{flexDirection:'row',padding:5}}>
                                                            <Text style={{fontSize:12,marginRight:5}}>{data.openingTime}</Text>
                                                            <Image source={require('../images/menu.png')} style={{width:8,height:8,top:4}}/>
                                                            
                                                    </TouchableOpacity>
                                            </Card>
                                                                                
                                            <Card style={{width:width/4.5,height:30,justifyContent:'center',alignItems:'center'}}>
                                                <TouchableOpacity onPress={()=>{
                                                    if(this.state.openingTimeModal==true){
                                                        this.setState({
                                                            openingTimeModal:!this.state.openingTimeModal,
                                                            dayIndex:index,
                                                            closingTimeModal:!this.state.closingTimeModal,
                                                        }) 

                                                    }
                                                    else{
                                                        this.setState({
                                                            closingTimeModal:!this.state.closingTimeModal,
                                                            dayIndex:index,
                                                        })

                                                    }
                                                    
                                                }} 
                                                style={{flexDirection:'row',padding:5}}>
                                                        <Text style={{fontSize:12,marginRight:5}}>{data.closingTime}</Text>
                                                        <Image source={require('../images/menu.png')} style={{width:8,height:8,top:4}}/>
                                                </TouchableOpacity>
                                            </Card>
                                                                    
                                </View>:null
                                        }
                                        
                                        <View style={{width:'68%',justifyContent:'flex-start',alignItems:'flex-start',flexDirection:'row'}}>
                                            {
                                                data.fullDay==true?
                                                <TouchableOpacity style={{width:18,height:18,borderRadius:100,borderColor:'#b68250',borderWidth:1,justifyContent:'center',alignItems:'center'}} 
                                                onPress={()=>{
                                                    var arr=this.state.weekDays;
                                                    arr[index].fullDay=!arr[index].fullDay
                                                    this.setState({
                                                        weekDays:arr,
                                                    })
                                                    
                                                }}> 
                                                 <View style={{width:9,height:9,backgroundColor:'#b68250',borderRadius:100}}/>                                           
                                               </TouchableOpacity>:
                                               <TouchableOpacity onPress={()=>{
                                                    var arr=this.state.weekDays;
                                                    arr[index].fullDay=!this.state.weekDays[index].fullDay
                                                    this.setState({
                                                        weekDays:arr,
                                                        closingTimeModal:false,
                                                        openingTimeModal:false
                                                    })
                                                    console.warn(this.state.closingTimeModal,this.state.openingTimeModal)
                                                }}
                                               style={{width:18,height:18,borderRadius:100,borderColor:'#b68250',borderWidth:1,justifyContent:'center',alignItems:'center'}}/>
                                            }

                                            <Text style={{marginHorizontal:10,fontSize:13,fontWeight:'400'}}>Open 24 Hours</Text>
                                            
                                        </View>


                                    </View>:null
                                 }
                                
                            </View>


                          
                           

                        </View>
                    )
                })
            }
        </View>
  }
  {
      this.props.HourSelected==true?
      <View style={{justifyContent:'center',alignItems:'center',marginVertical:20}}>
        {
        this.state.choosedWeekDays.length==0?
                <TouchableOpacity style={{width:'90%',marginVertical:20,borderRadius:5,alignSelf:'center',justifyContent:'center',alignItems:'center',backgroundColor:'#b68250'}} onPress={()=>{console.warn('modified '),this.setOpeningHours(this.state.choosedWeekDays)}}>
                        <Text style={{fontSize:17,color:'#FFF',marginVertical:10}}> Save </Text>
                </TouchableOpacity>:null
                
               
        }
    </View>:
<View style={{justifyContent:'center',alignItems:'center',marginVertical:20}}>
    {
      this.state.weekDays[0].choosed==true||this.state.weekDays[1].choosed==true||this.state.weekDays[2].choosed==true||this.state.weekDays[3].choosed==true||this.state.weekDays[4].choosed==true||this.state.weekDays[5].choosed==true||this.state.weekDays[6].choosed==true?
            <TouchableOpacity style={{width:'90%',marginVertical:20,borderRadius:5,alignSelf:'center',justifyContent:'center',alignItems:'center',backgroundColor:'#b68250'}} onPress={()=>{console.warn('not modified'),this.setOpeningHours(this.state.weekDays)}}>
                     <Text style={{fontSize:17,color:'#FFF',marginVertical:10}}> Save </Text>
            </TouchableOpacity>:null
         
    }
</View>
  }

        

       
    </ScrollView>

    <View style={{width:'100%',justifyContent:'center',alignItems:'center',position:'absolute'}}>
        <View style={{width:'95%',justifyContent:'center',alignItems:'center'}}>
        <View style={{marginLeft:37,width:'68%',flexDirection:'row',justifyContent:'space-between'}}>
            {
                this.state.openingTimeModal==true?
                <View  style={{alignItems:'flex-start',width:width,paddingVertical:10}}>
                <Card style={{width:width/4,height:height/1.2,justifyContent:'center',alignItems:'center'}}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        
                        
                        <TouchableOpacity >
                        {
                                this.state.openingTime.map((item,itemIndex)=>{
                                    return(
                                        <TouchableOpacity style={{marginBottom:10}} onPress={()=>{
                                            var arr=this.state.weekDays;
                                            arr[this.state.dayIndex].openingTime=item
                                            this.setState({weekDays:arr,
                                            openingTimeModal:!this.state.openingTimeModal})
                                        }}>
                                        <Text >{item}</Text>
                                        </TouchableOpacity>
                                    )
                                })
                            }
                            </TouchableOpacity>
                        
                        
                    </ScrollView>
                </Card>
                </View>:<View/>
                    
            }
                      

{
                this.state.choosedWeekDays[0].choosed==true||this.state.choosedWeekDays[1].choosed==true||this.state.choosedWeekDays[2].choosed==true||this.state.choosedWeekDays[3].choosed==true||this.state.choosedWeekDays[4].choosed==true||this.state.choosedWeekDays[5].choosed==true||this.state.choosedWeekDays[6].choosed==true?
                <View  style={{alignItems:'flex-end',paddingVertical:10}}>
                <Card style={{width:width/4,height:height/1.2,justifyContent:'center',alignItems:'center'}}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        
                        
                        <TouchableOpacity >
                        {
                                this.state.openingTime.map((item,itemIndex)=>{
                                    return(
                                        <TouchableOpacity style={{marginBottom:10}} onPress={()=>{
                                            var arr=this.state.weekDays;
                                            arr[this.state.dayIndex].closingTime=item
                                            this.setState({weekDays:arr,
                                            closingTimeModal:!this.state.closingTimeModal})
                                        }}>
                                        <Text >{item}</Text>
                                        </TouchableOpacity>
                                    )
                                })
                            }
                            </TouchableOpacity>
                        
                        
                    </ScrollView>
                    </Card>
                    </View>:<View/>
                    
                        }
        </View>

</View>
        </View>






        
      </View>
    );
  }
}

const styles=StyleSheet.create({
    mainContainer:{
        flex:1,
        backgroundColor:'#FFF',
        padding:10
    }
})

function mapStateToProps(state){
    return{
      mainCategoryIndex:state.mainCategoryIndex,
      mainSearchKey:state.mainSearchKey,
      searchedPlaceData:state.searchedPlaceData,
      routeMode:state.routeMode,
      opening_hours:state.opening_hours,
      HourSelected:state.HourSelected
    }
  }
  function mapDispatchToProps(dispatch){
    return{
        setSearchedPlaceData:(value)=>dispatch({type:'SET_SEARCHED_PLACE_DATA',value}),
        setRouteMode:(value)=>dispatch({type:'SET_ROUTE_MODE',value}),
        setOpeningHours:(value)=>dispatch({type:'setOpeningHours',value}),
        setHoursIsSelect:(value)=>dispatch({type:'choosedHours',value})
        
    }
  }
  
  export default connect(mapStateToProps,mapDispatchToProps)(OpeningHoursScreen);