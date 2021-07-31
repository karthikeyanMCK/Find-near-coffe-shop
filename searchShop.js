import React, { Component } from 'react';
import {Text,StyleSheet,View,FlatList,TextInput,Image,ScrollView,TouchableOpacity } from 'react-native';
import {connect} from 'react-redux'
 
class SearchFilter extends Component {
 
  static navigationOptions = {
    title:'Search',
    //headerStyle: { backgroundColor: '#ae0000'},
    //headerTitleStyle: { color: '#FFF' },
    // headerTintColor: 'white',
  }

  constructor(props) {
    super(props);
    this.state = { 
      isLoading: true,
      text: '',
      dataSource:[],
      arrayholder:[]}
  }
 
 async componentDidMount() {
  console.disableYellowBox=true;
  console.warn(this.props.searcharray) 
   await this.setState({dataSource:this.props.responseData,arrayholder:this.props.responseData}) 
  }

  async componentDidUpdate(prevProps){
    if(this.props.searcharray!==prevProps.searcharray){
      await this.setState({dataSource:this.props.searcharray,arrayholder:this.props.searcharray}) 
    }
  }

  SearchFilterFunction(text) {
    const newData = this.state.arrayholder.filter(item=> {
      const itemData =item.name.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) >= 0;
    });
    this.setState({dataSource: newData,text:text});
  }

  async navigateToShop(shopid){
    await this.props.shopId(shopid)
    this.props.navigation.navigate('selectedShop')
    this.setState({text:''})
  }

 

  render() {
   
     return(
      <View style={{flex: 1,marginTop: 10,padding: 16}}>
         <TextInput
          style={styles.textInputStyle}
          onChangeText={text => this.SearchFilterFunction(text)}
          value={this.state.text}
          underlineColorAndroid="transparent"
          placeholder="Search by shop"
        />
        {
          this.state.text==''?
         
          <View style={{paddingVertical:20}}>
          <Text style={{color:'black',fontSize:18}}>Popular shops</Text>
          <View>
          {
            this.state.dataSource.map((item,index)=>{
              
              return(
                <TouchableOpacity onPress={()=>this.navigateToMainCategory(item.id)}>
                    <View style={{flexDirection:'row',marginVertical:10}}>
                      <Image source={{uri:item.logo}} style={{width:50,height:50,resizeMode:'contain'}}/>
                      <View style={{marginLeft:20}}>
                        <Text style={{color:'black',marginBottom:5}}>{item.name}</Text>
                        <Text style={{fontSize:12}}>{item.address}</Text>
                      </View>
                    </View>
                </TouchableOpacity>
              )
              
            })
          }
          </View>
          </View>
          :
         
              <FlatList
                showsVerticalScrollIndicator={false}
                data={this.state.dataSource}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={()=>this.navigateToMainCategory(item.id)}>
                    <View style={{flexDirection:'row',marginVertical:10}}>
                      <Image source={{uri:item.logo}} style={{width:50,height:50,resizeMode:'contain'}}/>
                      <View style={{marginLeft:20}}>
                        <Text style={{color:'black',marginBottom:5}}>{item.name}</Text>
                        <Text style={{fontSize:12}}>{item.address}</Text>
                      </View>
                    </View>
                    
                  </TouchableOpacity>
                )}
                enableEmptySections={true}
                style={{ marginTop: 10 }}
                keyExtractor={(item, index) => index.toString()}
              />

          }
      </View>
     )
       
   
 }
}

function mapStateToProps(state){
  return{
    responseData:state.responseData
  }
}
function mapDispatchToProps(dispatch){
  return{
      shopId:(value)=>dispatch({type:'shopId',value}),
      productId:(value)=>dispatch({type:'productId',value}),
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(SearchFilter);



const styles = StyleSheet.create({
 
  textInputStyle: {
    height: 40,
    borderBottomWidth:1,
    paddingLeft: 10,
    borderColor: '#009688',
    backgroundColor: '#FFFFFF',
  },
});