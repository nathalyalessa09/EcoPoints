import React from 'react';
import {View,Text,StyleSheet,TouchableOpacity,ScrollView} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {colors} from '../theme/colors';
export default function PointDetailsScreen({navigation,route}){const p=route.params?.point; if(!p)return null;return <ScrollView style={s.root} contentContainerStyle={s.body}>
<TouchableOpacity onPress={()=>navigation.goBack()} accessibilityLabel="Voltar"><MaterialCommunityIcons name="arrow-left" size={27} color={colors.primaryDark}/></TouchableOpacity>
<Text style={s.title}>{p.name}</Text><Text style={s.address}>{p.address}</Text><View style={s.card}><Text style={s.subtitle}>Materiais aceitos</Text><Text style={s.info}>{p.materials.join(' • ')}</Text></View>
<View style={s.card}><Text style={s.subtitle}>Distância informada no protótipo</Text><Text style={s.info}>{p.distanceKm.toFixed(1)} km</Text></View>
<Text style={s.note}>Local fictício para demonstração. Não há máquina real cadastrada nem rota disponível.</Text>
</ScrollView>}
const s=StyleSheet.create({root:{flex:1,backgroundColor:colors.background},body:{padding:24,paddingTop:55},title:{fontSize:26,fontWeight:'800',color:colors.primaryDark,marginTop:25},address:{color:colors.textLight,marginTop:8,marginBottom:20},card:{backgroundColor:colors.white,padding:20,borderRadius:18,marginBottom:12},subtitle:{color:colors.textLight,fontSize:13},info:{fontSize:17,color:colors.primaryDark,fontWeight:'700',marginTop:7},note:{marginTop:12,color:colors.textLight,lineHeight:21}});
