import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { currentUser } from '../data/mockData';
const stats=[{label:'Itens reciclados',value:currentUser.itemsRecycled,icon:'recycle'},{label:'Peso estimado',value:'8,7 kg',icon:'weight-kilogram'},{label:'EcoPoints conquistados',value:currentUser.totalPoints,icon:'star-circle-outline'}];
const months=[['Mai',12],['Jun',20],['Jul',32],['Ago',23]];
export default function ImpactScreen(){return <ScrollView style={s.root} contentContainerStyle={s.body}>
<Text style={s.title}>Meu impacto ambiental 🌱</Text><Text style={s.subtitle}>Cada embalagem conta. Confira seu progresso!</Text>
<View style={s.hero}><MaterialCommunityIcons name="leaf" color={colors.primaryDark} size={32}/><Text style={s.big}>{currentUser.itemsRecycled}</Text><Text style={s.caption}>itens reciclados (demonstração)</Text></View>
{stats.map(item=><View key={item.label} style={s.card}><MaterialCommunityIcons name={item.icon} size={26} color={colors.primaryDark}/><View style={{marginLeft:14}}><Text style={s.stat}>{item.value}</Text><Text style={s.caption}>{item.label}</Text></View></View>)}
<Text style={s.section}>Evolução ilustrativa</Text><View style={s.chart}>{months.map(([m,n])=><View key={m} style={s.column}><Text style={s.caption}>{n}</Text><View style={[s.bar,{height:n*3}]}/><Text style={s.caption}>{m}</Text></View>)}</View>
<Text style={s.note}>Os dados são fictícios para demonstração acadêmica. O peso não foi medido por máquinas reais.</Text>
</ScrollView>}
const s=StyleSheet.create({root:{flex:1,backgroundColor:colors.background},body:{padding:22,paddingTop:58,paddingBottom:50},title:{fontSize:24,fontWeight:'800',color:colors.primaryDark},subtitle:{color:colors.textLight,marginTop:6,marginBottom:22},hero:{backgroundColor:colors.primaryLight,borderRadius:24,padding:22,alignItems:'center',marginBottom:14},big:{fontSize:48,fontWeight:'800',color:colors.primaryDark},caption:{color:colors.textLight,fontSize:12},card:{backgroundColor:colors.white,padding:17,borderRadius:17,flexDirection:'row',alignItems:'center',marginBottom:10},stat:{fontWeight:'800',fontSize:20,color:colors.primaryDark},section:{fontSize:18,fontWeight:'800',color:colors.primaryDark,marginTop:20,marginBottom:12},chart:{height:145,flexDirection:'row',alignItems:'flex-end',justifyContent:'space-around',backgroundColor:colors.white,borderRadius:18,padding:14},column:{alignItems:'center',justifyContent:'flex-end'},bar:{width:36,backgroundColor:colors.primary,borderRadius:7,marginVertical:5},note:{fontSize:12,color:colors.textLight,marginTop:20,lineHeight:18}});
