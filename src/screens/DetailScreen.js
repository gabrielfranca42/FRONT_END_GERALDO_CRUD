import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  StatusBar, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS, GENRE_COLORS } from '../constants/theme';

export default function DetailScreen({ route, navigation }) {
  const { livro } = route.params;
  const genreColor = GENRE_COLORS[livro.genero] || COLORS.textMuted;

  const confirmarExclusao = () => {
    Alert.alert('🗑️ Excluir Livro', `Excluir "${livro.titulo}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: excluir },
    ]);
  };

  const excluir = async () => {
    try {
      await api.delete(`/livros/${livro._id}`);
      navigation.goBack();
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível excluir.');
    }
  };

  const formatDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('pt-BR', {
      day: '2-digit', month: 'long', year: 'numeric',
    });
  };

  const InfoRow = ({ icon, label, value, color }) => (
    <View style={s.infoRow}>
      <View style={[s.infoIcon, { backgroundColor: (color || COLORS.primary) + '15' }]}>
        <Ionicons name={icon} size={20} color={color || COLORS.primary} />
      </View>
      <View style={s.infoContent}>
        <Text style={s.infoLabel}>{label}</Text>
        <Text style={s.infoValue}>{value}</Text>
      </View>
    </View>
  );

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Detalhes</Text>
        <TouchableOpacity style={s.editHeaderBtn}
          onPress={() => navigation.navigate('Formulario', { livro })}>
          <Ionicons name="pencil" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Hero section */}
        <View style={s.hero}>
          <View style={[s.bookIcon, { backgroundColor: genreColor + '20' }]}>
            <Ionicons name="book" size={48} color={genreColor} />
          </View>
          <View style={[s.genreBadge, { backgroundColor: genreColor + '20' }]}>
            <Text style={[s.genreText, { color: genreColor }]}>{livro.genero}</Text>
          </View>
          <Text style={s.titulo}>{livro.titulo}</Text>
          <Text style={s.autor}>por {livro.autor}</Text>
          {livro.lido && (
            <View style={s.lidoBadge}>
              <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
              <Text style={s.lidoText}>Leitura concluída</Text>
            </View>
          )}
        </View>

        {/* Info card */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Informações</Text>
          <InfoRow icon="book-outline" label="Título" value={livro.titulo} />
          <InfoRow icon="person-outline" label="Autor" value={livro.autor}
            color="#FF6B6B" />
          <InfoRow icon="pricetag-outline" label="Gênero" value={livro.genero}
            color={genreColor} />
          <InfoRow icon="calendar-outline" label="Ano de Publicação"
            value={livro.anoPublicacao?.toString()} color="#FFA502" />
          <InfoRow icon={livro.lido ? 'checkmark-circle-outline' : 'time-outline'}
            label="Status" value={livro.lido ? 'Lido' : 'Não lido'}
            color={livro.lido ? COLORS.success : COLORS.warning} />
          <InfoRow icon="time-outline" label="Cadastrado em"
            value={formatDate(livro.createdAt)} color="#45AAF2" />
        </View>

        {/* Actions */}
        <View style={s.actions}>
          <TouchableOpacity style={s.editBtn} activeOpacity={0.8}
            onPress={() => navigation.navigate('Formulario', { livro })}>
            <Ionicons name="pencil" size={20} color={COLORS.white} />
            <Text style={s.editBtnText}>Editar Livro</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.deleteBtn} activeOpacity={0.8}
            onPress={confirmarExclusao}>
            <Ionicons name="trash" size={20} color={COLORS.danger} />
            <Text style={s.deleteBtnText}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.md, paddingTop: SPACING.xxl + 10, paddingBottom: SPACING.md,
    backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surfaceLight, justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: { fontSize: FONTS.large, fontWeight: '700', color: COLORS.text },
  editHeaderBtn: {
    width: 40, height: 40, borderRadius: RADIUS.sm,
    backgroundColor: COLORS.primary + '15', justifyContent: 'center', alignItems: 'center',
  },
  scrollContent: { padding: SPACING.lg, paddingBottom: SPACING.xxl },

  // Hero
  hero: { alignItems: 'center', marginBottom: SPACING.lg },
  bookIcon: {
    width: 100, height: 100, borderRadius: 50,
    justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.md,
  },
  genreBadge: {
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.round, marginBottom: SPACING.md,
  },
  genreText: { fontSize: FONTS.small, fontWeight: '700' },
  titulo: {
    fontSize: FONTS.title, fontWeight: '800', color: COLORS.text,
    textAlign: 'center', marginBottom: SPACING.xs,
  },
  autor: { fontSize: FONTS.large, color: COLORS.textSecondary, marginBottom: SPACING.sm },
  lidoBadge: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.successSoft,
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.round, marginTop: SPACING.sm,
  },
  lidoText: { fontSize: FONTS.small, color: COLORS.success, fontWeight: '700', marginLeft: 6 },

  // Card
  card: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.lg,
    padding: SPACING.lg, marginBottom: SPACING.lg, ...SHADOWS.medium,
  },
  cardTitle: {
    fontSize: FONTS.large, fontWeight: '700', color: COLORS.text,
    marginBottom: SPACING.md, paddingBottom: SPACING.sm,
    borderBottomWidth: 1, borderBottomColor: COLORS.divider,
  },
  infoRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: SPACING.sm + 2,
  },
  infoIcon: {
    width: 40, height: 40, borderRadius: RADIUS.sm,
    justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md,
  },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: FONTS.xsmall, color: COLORS.textMuted, fontWeight: '500' },
  infoValue: { fontSize: FONTS.regular, color: COLORS.text, fontWeight: '600', marginTop: 2 },

  // Actions
  actions: { flexDirection: 'row', gap: SPACING.md },
  editBtn: {
    flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    backgroundColor: COLORS.primary, borderRadius: RADIUS.md,
    paddingVertical: SPACING.md, gap: SPACING.sm, ...SHADOWS.medium,
  },
  editBtnText: { fontSize: FONTS.regular, fontWeight: '700', color: COLORS.white },
  deleteBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.danger + '15', borderRadius: RADIUS.md,
    paddingVertical: SPACING.md, paddingHorizontal: SPACING.lg, gap: SPACING.xs,
  },
  deleteBtnText: { fontSize: FONTS.regular, fontWeight: '700', color: COLORS.danger },
});
