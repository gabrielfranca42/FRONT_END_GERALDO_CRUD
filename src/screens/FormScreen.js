import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, ActivityIndicator, Switch, StatusBar,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

const GENEROS = [
  'Ficção','Não-Ficção','Romance','Terror','Fantasia',
  'Ficção Científica','Biografia','História','Autoajuda',
  'Técnico','Infantil','Outro',
];

export default function FormScreen({ route, navigation }) {
  const livroExistente = route.params?.livro;
  const editando = !!livroExistente;

  const [titulo, setTitulo] = useState(livroExistente?.titulo || '');
  const [autor, setAutor] = useState(livroExistente?.autor || '');
  const [genero, setGenero] = useState(livroExistente?.genero || '');
  const [anoPublicacao, setAnoPublicacao] = useState(
    livroExistente?.anoPublicacao?.toString() || ''
  );
  const [lido, setLido] = useState(livroExistente?.lido || false);
  const [salvando, setSalvando] = useState(false);
  const [errors, setErrors] = useState({});

  const validar = () => {
    const e = {};
    if (!titulo.trim()) e.titulo = 'Informe o título';
    if (!autor.trim()) e.autor = 'Informe o autor';
    if (!genero) e.genero = 'Selecione um gênero';
    if (!anoPublicacao.trim()) {
      e.anoPublicacao = 'Informe o ano';
    } else {
      const a = parseInt(anoPublicacao);
      if (isNaN(a) || a < 1000 || a > new Date().getFullYear())
        e.anoPublicacao = 'Ano inválido';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const salvar = async () => {
    if (!validar()) return;
    setSalvando(true);
    try {
      const dados = {
        titulo: titulo.trim(), autor: autor.trim(),
        genero, anoPublicacao: parseInt(anoPublicacao), lido,
      };
      if (editando) await api.put(`/livros/${livroExistente._id}`, dados);
      else await api.post('/livros', dados);
      navigation.goBack();
    } catch (error) {
      const msg = error.response?.data?.erros?.join('\n') ||
        error.response?.data?.mensagem || 'Erro ao salvar.';
      Alert.alert('Erro', msg);
    } finally { setSalvando(false); }
  };

  return (
    <KeyboardAvoidingView style={s.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <View style={s.headerCenter}>
          <Text style={s.headerTitle}>{editando ? 'Editar Livro' : 'Novo Livro'}</Text>
          <Text style={s.headerSub}>
            {editando ? 'Atualize as informações' : 'Preencha os dados'}
          </Text>
        </View>
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* Título */}
        <View style={s.field}>
          <Text style={s.label}>Título</Text>
          <View style={[s.inputWrap, errors.titulo && s.inputErr]}>
            <Ionicons name="book" size={20} color={COLORS.textMuted} />
            <TextInput style={s.input} value={titulo} onChangeText={setTitulo}
              placeholder="Ex: Dom Casmurro" placeholderTextColor={COLORS.textMuted}
              maxLength={200} />
          </View>
          {errors.titulo && <Text style={s.errText}>{errors.titulo}</Text>}
        </View>

        {/* Autor */}
        <View style={s.field}>
          <Text style={s.label}>Autor</Text>
          <View style={[s.inputWrap, errors.autor && s.inputErr]}>
            <Ionicons name="person" size={20} color={COLORS.textMuted} />
            <TextInput style={s.input} value={autor} onChangeText={setAutor}
              placeholder="Ex: Machado de Assis" placeholderTextColor={COLORS.textMuted}
              maxLength={150} />
          </View>
          {errors.autor && <Text style={s.errText}>{errors.autor}</Text>}
        </View>

        {/* Ano */}
        <View style={s.field}>
          <Text style={s.label}>Ano de Publicação</Text>
          <View style={[s.inputWrap, errors.anoPublicacao && s.inputErr]}>
            <Ionicons name="calendar" size={20} color={COLORS.textMuted} />
            <TextInput style={s.input} value={anoPublicacao}
              onChangeText={setAnoPublicacao} placeholder="Ex: 1899"
              placeholderTextColor={COLORS.textMuted} keyboardType="numeric" maxLength={4} />
          </View>
          {errors.anoPublicacao && <Text style={s.errText}>{errors.anoPublicacao}</Text>}
        </View>

        {/* Gênero */}
        <View style={s.field}>
          <Text style={s.label}>Gênero</Text>
          {errors.genero && <Text style={s.errText}>{errors.genero}</Text>}
          <View style={s.genreGrid}>
            {GENEROS.map((g) => (
              <TouchableOpacity key={g}
                style={[s.chip, genero === g && s.chipActive]}
                onPress={() => { setGenero(g); setErrors(p => ({...p, genero:null})); }}>
                <Text style={[s.chipText, genero === g && s.chipTextActive]}>{g}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Switch Lido */}
        <View style={s.switchBox}>
          <View style={s.switchInfo}>
            <Ionicons name={lido ? 'checkmark-circle' : 'ellipse-outline'}
              size={24} color={lido ? COLORS.success : COLORS.textMuted} />
            <View style={{marginLeft:12}}>
              <Text style={s.switchLabel}>Já leu este livro?</Text>
              <Text style={s.switchHint}>{lido ? 'Marcado como lido ✓' : 'Ainda não lido'}</Text>
            </View>
          </View>
          <Switch value={lido} onValueChange={setLido}
            trackColor={{false:COLORS.border, true:COLORS.success+'60'}}
            thumbColor={lido ? COLORS.success : COLORS.textMuted} />
        </View>

        {/* Botão Salvar */}
        <TouchableOpacity style={[s.saveBtn, salvando && {opacity:0.6}]}
          onPress={salvar} disabled={salvando} activeOpacity={0.8}>
          {salvando ? <ActivityIndicator color={COLORS.white} /> : (
            <>
              <Ionicons name={editando?'checkmark-done':'add-circle'} size={22} color={COLORS.white}/>
              <Text style={s.saveBtnText}>
                {editando ? 'Salvar Alterações' : 'Cadastrar Livro'}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { flex:1, backgroundColor:COLORS.background },
  header: {
    flexDirection:'row', alignItems:'center', paddingHorizontal:SPACING.md,
    paddingTop:SPACING.xxl+10, paddingBottom:SPACING.md,
    backgroundColor:COLORS.surface, borderBottomWidth:1, borderBottomColor:COLORS.border,
  },
  backBtn: {
    width:40, height:40, borderRadius:RADIUS.sm,
    backgroundColor:COLORS.surfaceLight, justifyContent:'center', alignItems:'center',
  },
  headerCenter: { flex:1, marginLeft:SPACING.md },
  headerTitle: { fontSize:FONTS.xlarge, fontWeight:'700', color:COLORS.text },
  headerSub: { fontSize:FONTS.xsmall, color:COLORS.textSecondary, marginTop:2 },
  scroll: { flex:1 },
  scrollContent: { padding:SPACING.lg, paddingBottom:SPACING.xxl },
  field: { marginBottom:SPACING.lg },
  label: {
    fontSize:FONTS.small, fontWeight:'600', color:COLORS.textSecondary,
    marginBottom:SPACING.sm, textTransform:'uppercase', letterSpacing:0.8,
  },
  inputWrap: {
    flexDirection:'row', alignItems:'center', backgroundColor:COLORS.surface,
    borderRadius:RADIUS.md, borderWidth:1.5, borderColor:COLORS.border,
    paddingHorizontal:SPACING.md, height:54, gap:SPACING.sm,
  },
  inputErr: { borderColor:COLORS.danger },
  input: { flex:1, fontSize:FONTS.regular, color:COLORS.text },
  errText: { fontSize:FONTS.xsmall, color:COLORS.danger, marginTop:SPACING.xs },
  genreGrid: { flexDirection:'row', flexWrap:'wrap', gap:SPACING.sm },
  chip: {
    paddingHorizontal:SPACING.md, paddingVertical:SPACING.sm+2,
    borderRadius:RADIUS.round, backgroundColor:COLORS.surface,
    borderWidth:1.5, borderColor:COLORS.border,
  },
  chipActive: { backgroundColor:COLORS.primary+'20', borderColor:COLORS.primary },
  chipText: { fontSize:FONTS.small, color:COLORS.textMuted, fontWeight:'500' },
  chipTextActive: { color:COLORS.primary, fontWeight:'700' },
  switchBox: {
    flexDirection:'row', justifyContent:'space-between', alignItems:'center',
    backgroundColor:COLORS.surface, borderRadius:RADIUS.md, padding:SPACING.md,
    marginBottom:SPACING.xl, borderWidth:1, borderColor:COLORS.border,
  },
  switchInfo: { flexDirection:'row', alignItems:'center', flex:1 },
  switchLabel: { fontSize:FONTS.regular, fontWeight:'600', color:COLORS.text },
  switchHint: { fontSize:FONTS.xsmall, color:COLORS.textSecondary, marginTop:2 },
  saveBtn: {
    flexDirection:'row', justifyContent:'center', alignItems:'center',
    backgroundColor:COLORS.primary, borderRadius:RADIUS.md,
    paddingVertical:SPACING.md+2, gap:SPACING.sm, ...SHADOWS.medium,
  },
  saveBtnText: { fontSize:FONTS.large, fontWeight:'700', color:COLORS.white },
});
