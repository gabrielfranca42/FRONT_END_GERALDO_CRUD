import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Animated,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import api from '../services/api';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS, GENRE_COLORS } from '../constants/theme';

export default function HomeScreen({ navigation }) {
  const [livros, setLivros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const carregarLivros = async () => {
    try {
      const response = await api.get('/livros');
      if (response.data.sucesso) {
        setLivros(response.data.dados);
      }
    } catch (error) {
      Alert.alert(
        'Erro',
        'Não foi possível carregar os livros. Verifique sua conexão.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      carregarLivros();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    carregarLivros();
  };

  const confirmarExclusao = (id, titulo) => {
    Alert.alert(
      '🗑️ Excluir Livro',
      `Tem certeza que deseja excluir "${titulo}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => excluirLivro(id),
        },
      ]
    );
  };

  const excluirLivro = async (id) => {
    try {
      const response = await api.delete(`/livros/${id}`);
      if (response.data.sucesso) {
        setLivros((prev) => prev.filter((livro) => livro._id !== id));
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível excluir o livro.');
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View>
          <Text style={styles.headerGreeting}>Minha</Text>
          <Text style={styles.headerTitle}>Biblioteca 📚</Text>
        </View>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>{livros.length}</Text>
          <Text style={styles.headerBadgeLabel}>livros</Text>
        </View>
      </View>
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
          <Text style={styles.statText}>
            {livros.filter((l) => l.lido).length} lidos
          </Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Ionicons name="time" size={18} color={COLORS.warning} />
          <Text style={styles.statText}>
            {livros.filter((l) => !l.lido).length} pendentes
          </Text>
        </View>
      </View>
    </View>
  );

  const renderBookCard = ({ item, index }) => {
    const genreColor = GENRE_COLORS[item.genero] || COLORS.textMuted;

    return (
      <Animated.View style={[styles.card, { opacity: 1 }]}>
        <TouchableOpacity
          style={styles.cardContent}
          onPress={() => navigation.navigate('Detalhes', { livro: item })}
          activeOpacity={0.7}
        >
          {/* Barra lateral colorida */}
          <View style={[styles.cardAccent, { backgroundColor: genreColor }]} />

          <View style={styles.cardBody}>
            {/* Topo: Gênero + Status */}
            <View style={styles.cardTopRow}>
              <View style={[styles.genreBadge, { backgroundColor: genreColor + '20' }]}>
                <Text style={[styles.genreText, { color: genreColor }]}>
                  {item.genero}
                </Text>
              </View>
              {item.lido && (
                <View style={styles.lidoBadge}>
                  <Ionicons name="checkmark-circle" size={14} color={COLORS.success} />
                  <Text style={styles.lidoText}>Lido</Text>
                </View>
              )}
            </View>

            {/* Título e Autor */}
            <Text style={styles.cardTitle} numberOfLines={2}>
              {item.titulo}
            </Text>
            <Text style={styles.cardAuthor} numberOfLines={1}>
              {item.autor}
            </Text>

            {/* Rodapé: Ano + Ações */}
            <View style={styles.cardFooter}>
              <View style={styles.yearBadge}>
                <Ionicons name="calendar-outline" size={13} color={COLORS.textMuted} />
                <Text style={styles.yearText}>{item.anoPublicacao}</Text>
              </View>
              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => navigation.navigate('Formulario', { livro: item })}
                >
                  <Ionicons name="pencil" size={18} color={COLORS.primaryLight} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.deleteBtn]}
                  onPress={() => confirmarExclusao(item._id, item.titulo)}
                >
                  <Ionicons name="trash" size={18} color={COLORS.danger} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconBg}>
        <Ionicons name="book-outline" size={60} color={COLORS.primaryLight} />
      </View>
      <Text style={styles.emptyTitle}>Nenhum livro cadastrado</Text>
      <Text style={styles.emptySubtitle}>
        Toque no botão + para adicionar seu primeiro livro à biblioteca
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Carregando livros...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <FlatList
        data={livros}
        keyExtractor={(item) => item._id}
        renderItem={renderBookCard}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
            progressBackgroundColor={COLORS.surface}
          />
        }
      />

      {/* FAB - Botão flutuante */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('Formulario')}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={30} color={COLORS.white} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: SPACING.md,
    color: COLORS.textSecondary,
    fontSize: FONTS.regular,
  },
  listContent: {
    paddingBottom: 100,
  },

  // Header
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xxl + 10,
    paddingBottom: SPACING.lg,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerGreeting: {
    fontSize: FONTS.large,
    color: COLORS.textSecondary,
    fontWeight: '400',
  },
  headerTitle: {
    fontSize: FONTS.hero,
    color: COLORS.text,
    fontWeight: '800',
    marginTop: 2,
  },
  headerBadge: {
    backgroundColor: COLORS.primarySoft,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    minWidth: 60,
  },
  headerBadgeText: {
    fontSize: FONTS.xlarge,
    fontWeight: '800',
    color: COLORS.primary,
  },
  headerBadgeLabel: {
    fontSize: FONTS.xsmall,
    color: COLORS.primaryDark,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  statText: {
    marginLeft: SPACING.sm,
    color: COLORS.textSecondary,
    fontSize: FONTS.small,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: COLORS.border,
  },

  // Card
  card: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surface,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  cardContent: {
    flexDirection: 'row',
  },
  cardAccent: {
    width: 4,
  },
  cardBody: {
    flex: 1,
    padding: SPACING.md,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  genreBadge: {
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.round,
  },
  genreText: {
    fontSize: FONTS.xsmall,
    fontWeight: '700',
  },
  lidoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.successSoft,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.round,
  },
  lidoText: {
    fontSize: FONTS.xsmall,
    color: COLORS.success,
    fontWeight: '700',
    marginLeft: 3,
  },
  cardTitle: {
    fontSize: FONTS.large,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
    lineHeight: 24,
  },
  cardAuthor: {
    fontSize: FONTS.small,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.xs,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    paddingTop: SPACING.sm,
  },
  yearBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  yearText: {
    fontSize: FONTS.xsmall,
    color: COLORS.textMuted,
    marginLeft: 4,
  },
  cardActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBtn: {
    backgroundColor: COLORS.danger + '15',
  },

  // Empty state
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl * 2,
    paddingHorizontal: SPACING.xl,
  },
  emptyIconBg: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  emptyTitle: {
    fontSize: FONTS.xlarge,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  emptySubtitle: {
    fontSize: FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: SPACING.xl,
    right: SPACING.lg,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.large,
  },
});
