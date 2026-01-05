import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Package, Trash2, Eye } from 'lucide-react-native';
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProducts } from '@/contexts/ProductsContext';
import { productTypes } from '@/constants/products';

export default function LibraryScreen() {
  const { t, language } = useLanguage();
  const { library, deleteProduct } = useProducts();
  const router = useRouter();

  const handleDelete = (productId: string, productName: string) => {
    Alert.alert(
      t.common.delete,
      language === 'es'
        ? `¿Eliminar "${productName}"?`
        : `Delete "${productName}"?`,
      [
        {
          text: t.common.cancel,
          style: 'cancel',
        },
        {
          text: t.common.delete,
          style: 'destructive',
          onPress: () => deleteProduct(productId),
        },
      ]
    );
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (library.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.title}>{t.library.title}</Text>
        </View>

        <View style={styles.emptyContainer}>
          <Package color="#cbd5e1" size={80} strokeWidth={1.5} />
          <Text style={styles.emptyTitle}>{t.library.empty}</Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => router.push('/(tabs)/products')}
            activeOpacity={0.8}
          >
            <Text style={styles.emptyButtonText}>{t.library.createFirst}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>{t.library.title}</Text>
        <Text style={styles.subtitle}>
          {library.length} {language === 'es' ? 'productos' : 'products'}
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {library.map(product => (
          <View key={product.id} style={styles.card}>
            <LinearGradient
              colors={product.coverStyle.gradient}
              style={styles.cardCover}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.cardBadge}>
                <Text style={styles.cardBadgeText}>
                  {product.isMega ? 'MEGA' : product.productIds.length}
                </Text>
              </View>
            </LinearGradient>

            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{product.name}</Text>
              <Text style={styles.cardDate}>{formatDate(product.createdAt)}</Text>

              <View style={styles.cardInfo}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>
                    {language === 'es' ? 'Portada' : 'Cover'}
                  </Text>
                  <Text style={styles.infoValue}>{product.coverStyle.name}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>
                    {language === 'es' ? 'Papel' : 'Paper'}
                  </Text>
                  <Text style={styles.infoValue}>{product.paperType.name}</Text>
                </View>
              </View>

              <View style={styles.productsList}>
                {product.productIds.slice(0, 3).map(id => {
                  const productType = productTypes.find(p => p.id === id);
                  if (!productType) return null;

                  const name = language === 'es' ? productType.nameEs : productType.nameEn;

                  return (
                    <View key={id} style={styles.productTag}>
                      <Text style={styles.productTagText} numberOfLines={1}>
                        {name}
                      </Text>
                    </View>
                  );
                })}
                {product.productIds.length > 3 && (
                  <View style={styles.productTag}>
                    <Text style={styles.productTagText}>
                      +{product.productIds.length - 3}
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={styles.actionButtonPrimary}
                  activeOpacity={0.8}
                >
                  <Eye color="#ffffff" size={20} />
                  <Text style={styles.actionButtonPrimaryText}>{t.library.open}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButtonDanger}
                  onPress={() => handleDelete(product.id, product.name)}
                  activeOpacity={0.8}
                >
                  <Trash2 color="#ef4444" size={20} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: '#1e293b',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: '#64748b',
    marginTop: 24,
    marginBottom: 32,
    textAlign: 'center',
  },
  emptyButton: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  emptyButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardCover: {
    height: 120,
    padding: 16,
  },
  cardBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  cardBadgeText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: '#ffffff',
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#1e293b',
    marginBottom: 4,
  },
  cardDate: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 16,
  },
  cardInfo: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#475569',
  },
  productsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  productTag: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    maxWidth: '45%',
  },
  productTagText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500' as const,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButtonPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366f1',
    borderRadius: 12,
    paddingVertical: 12,
    gap: 8,
  },
  actionButtonPrimaryText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#ffffff',
  },
  actionButtonDanger: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
});
