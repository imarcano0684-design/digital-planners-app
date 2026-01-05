import { useRouter } from 'expo-router';
import { Check, BookOpen, Heart, Package, TrendingUp } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProducts } from '@/contexts/ProductsContext';
import { productTypes } from '@/constants/products';
import type { ProductCategory } from '@/constants/products';

const { width } = Dimensions.get('window');

const categoryIcons: Record<ProductCategory, any> = {
  notebooks: BookOpen,
  journals: BookOpen,
  wellness: Heart,
  agendas: Package,
  planners: Package,
  trackers: TrendingUp,
  calendars: Package,
  reviews: BookOpen,
  organizers: Package,
  guides: BookOpen,
  writing: BookOpen,
  templates: Package,
  exercises: BookOpen,
  business: TrendingUp,
  goals: TrendingUp,
};

export default function ProductsScreen() {
  const { t, language } = useLanguage();
  const { selectedProductIds, toggleProduct, selectAll, deselectAll } = useProducts();
  const router = useRouter();

  const groupedProducts = useMemo(() => {
    const groups: Record<ProductCategory, typeof productTypes> = {} as any;
    
    productTypes.forEach(product => {
      if (!groups[product.category]) {
        groups[product.category] = [];
      }
      groups[product.category].push(product);
    });

    return groups;
  }, []);

  const handleCreate = () => {
    if (selectedProductIds.length === 0) {
      return;
    }
    router.push('/(tabs)/customize');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>{t.products.title}</Text>
        <Text style={styles.subtitle}>{t.products.subtitle}</Text>
        
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={selectedProductIds.length === productTypes.length ? deselectAll : selectAll}
          >
            <Text style={styles.actionButtonText}>
              {selectedProductIds.length === productTypes.length
                ? t.products.deselectAll
                : t.products.selectAll}
            </Text>
          </TouchableOpacity>
          
          <View style={styles.counterBadge}>
            <Text style={styles.counterText}>
              {selectedProductIds.length} {t.products.selected}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {Object.entries(groupedProducts).map(([category, products]) => {
          const Icon = categoryIcons[category as ProductCategory];
          const categoryName = t.products.categories[category as ProductCategory];

          return (
            <View key={category} style={styles.categorySection}>
              <View style={styles.categoryHeader}>
                <Icon color="#6366f1" size={20} />
                <Text style={styles.categoryTitle}>{categoryName}</Text>
              </View>

              <View style={styles.productsGrid}>
                {products.map(product => {
                  const isSelected = selectedProductIds.includes(product.id);
                  const productName = language === 'es' ? product.nameEs : product.nameEn;
                  const productDesc = language === 'es' ? product.descriptionEs : product.descriptionEn;

                  return (
                    <TouchableOpacity
                      key={product.id}
                      style={[
                        styles.productCard,
                        isSelected && styles.productCardSelected,
                      ]}
                      onPress={() => toggleProduct(product.id)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.productContent}>
                        <Text style={[styles.productName, isSelected && styles.productNameSelected]}>
                          {productName}
                        </Text>
                        <Text style={styles.productDesc} numberOfLines={2}>
                          {productDesc}
                        </Text>
                      </View>
                      
                      {isSelected && (
                        <View style={styles.checkmark}>
                          <Check color="#ffffff" size={16} strokeWidth={3} />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          );
        })}
      </ScrollView>

      {selectedProductIds.length > 0 && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreate}
            activeOpacity={0.8}
          >
            <Text style={styles.createButtonText}>
              {selectedProductIds.length === productTypes.length
                ? t.products.createMega
                : t.products.createSelected}
            </Text>
          </TouchableOpacity>
        </View>
      )}
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
    marginBottom: 16,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#6366f1',
  },
  counterBadge: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#6366f1',
    borderRadius: 8,
  },
  counterText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  categorySection: {
    marginBottom: 32,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#1e293b',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  productCard: {
    width: (width - 52) / 2,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    minHeight: 100,
  },
  productCardSelected: {
    borderColor: '#6366f1',
    backgroundColor: '#eef2ff',
  },
  productContent: {
    flex: 1,
  },
  productName: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: '#1e293b',
    marginBottom: 6,
  },
  productNameSelected: {
    color: '#6366f1',
  },
  productDesc: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  createButton: {
    backgroundColor: '#6366f1',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  createButtonText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#ffffff',
  },
});
