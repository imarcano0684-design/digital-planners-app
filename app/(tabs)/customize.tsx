import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Palette, FileText, Sticker, Check } from 'lucide-react-native';
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProducts, type CoverStyle, type PaperType } from '@/contexts/ProductsContext';
import { productTypes } from '@/constants/products';

const coverStyles: CoverStyle[] = [
  { id: 'elegant', name: 'Elegant', gradient: ['#1e3a8a', '#3b82f6'] as const, accentColor: '#3b82f6' },
  { id: 'floral', name: 'Floral', gradient: ['#881337', '#f43f5e'] as const, accentColor: '#f43f5e' },
  { id: 'nature', name: 'Nature', gradient: ['#064e3b', '#10b981'] as const, accentColor: '#10b981' },
  { id: 'sunset', name: 'Sunset', gradient: ['#ea580c', '#fbbf24'] as const, accentColor: '#f59e0b' },
  { id: 'lavender', name: 'Lavender', gradient: ['#6b21a8', '#a855f7'] as const, accentColor: '#a855f7' },
  { id: 'ocean', name: 'Ocean', gradient: ['#0c4a6e', '#0ea5e9'] as const, accentColor: '#0ea5e9' },
  { id: 'rose', name: 'Rose', gradient: ['#9f1239', '#fb7185'] as const, accentColor: '#fb7185' },
  { id: 'forest', name: 'Forest', gradient: ['#14532d', '#22c55e'] as const, accentColor: '#22c55e' },
];

const paperTypes: PaperType[] = [
  { id: 'lined', name: 'Lined', pattern: 'lined' },
  { id: 'grid', name: 'Grid', pattern: 'grid' },
  { id: 'dotted', name: 'Dotted', pattern: 'dotted' },
  { id: 'blank', name: 'Blank', pattern: 'blank' },
  { id: 'guided', name: 'Guided', pattern: 'guided' },
];

export default function CustomizeScreen() {
  const { t, language } = useLanguage();
  const { selectedProductIds, createProduct } = useProducts();
  const router = useRouter();

  const [productName, setProductName] = useState('');
  const [selectedCover, setSelectedCover] = useState<CoverStyle>(coverStyles[0]);
  const [selectedPaper, setSelectedPaper] = useState<PaperType>(paperTypes[0]);

  const handleCreate = async () => {
    if (!productName.trim()) {
      Alert.alert(
        t.common.error,
        language === 'es' ? 'Por favor ingresa un nombre' : 'Please enter a name'
      );
      return;
    }

    if (selectedProductIds.length === 0) {
      Alert.alert(
        t.common.error,
        language === 'es' ? 'Selecciona al menos un producto' : 'Select at least one product'
      );
      return;
    }

    const isMega = selectedProductIds.length === productTypes.length;

    await createProduct(
      selectedProductIds,
      productName,
      selectedCover,
      selectedPaper,
      isMega
    );

    Alert.alert(
      t.common.success,
      language === 'es' ? '¡Producto creado exitosamente!' : 'Product created successfully!',
      [
        {
          text: 'OK',
          onPress: () => router.push('/(tabs)/library'),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>{t.customize.title}</Text>
        <Text style={styles.subtitle}>
          {selectedProductIds.length} {t.products.selected}
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FileText color="#6366f1" size={20} />
            <Text style={styles.sectionTitle}>
              {language === 'es' ? 'Nombre del Producto' : 'Product Name'}
            </Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder={language === 'es' ? 'Mi Diario 2024' : 'My Journal 2024'}
            value={productName}
            onChangeText={setProductName}
            placeholderTextColor="#94a3b8"
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Palette color="#6366f1" size={20} />
            <Text style={styles.sectionTitle}>{t.customize.covers}</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {coverStyles.map(cover => (
              <TouchableOpacity
                key={cover.id}
                onPress={() => setSelectedCover(cover)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={cover.gradient}
                  style={[
                    styles.coverOption,
                    selectedCover.id === cover.id && styles.coverOptionSelected,
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  {selectedCover.id === cover.id && (
                    <View style={styles.coverCheck}>
                      <Check color="#ffffff" size={20} strokeWidth={3} />
                    </View>
                  )}
                </LinearGradient>
                <Text style={styles.coverName}>{cover.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Sticker color="#6366f1" size={20} />
            <Text style={styles.sectionTitle}>{t.customize.papers}</Text>
          </View>
          <View style={styles.paperGrid}>
            {paperTypes.map(paper => (
              <TouchableOpacity
                key={paper.id}
                style={[
                  styles.paperOption,
                  selectedPaper.id === paper.id && styles.paperOptionSelected,
                ]}
                onPress={() => setSelectedPaper(paper)}
                activeOpacity={0.7}
              >
                <View style={[styles.paperPreview, styles[`paper_${paper.pattern}`]]} />
                <Text
                  style={[
                    styles.paperName,
                    selectedPaper.id === paper.id && styles.paperNameSelected,
                  ]}
                >
                  {paper.name}
                </Text>
                {selectedPaper.id === paper.id && (
                  <View style={styles.paperCheck}>
                    <Check color="#ffffff" size={16} strokeWidth={3} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.previewSection}>
          <Text style={styles.previewTitle}>
            {language === 'es' ? 'Vista Previa' : 'Preview'}
          </Text>
          <LinearGradient
            colors={selectedCover.gradient}
            style={styles.preview}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.previewName}>{productName || t.customize.title}</Text>
            <View style={styles.previewBadge}>
              <Text style={styles.previewBadgeText}>
                {selectedProductIds.length === productTypes.length ? 'MEGA' : `${selectedProductIds.length}`}
              </Text>
            </View>
          </LinearGradient>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreate}
          activeOpacity={0.8}
        >
          <Text style={styles.createButtonText}>{t.common.save}</Text>
        </TouchableOpacity>
      </View>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#1e293b',
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1e293b',
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  horizontalScroll: {
    gap: 16,
    paddingRight: 20,
  },
  coverOption: {
    width: 100,
    height: 140,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverOptionSelected: {
    borderWidth: 3,
    borderColor: '#6366f1',
  },
  coverCheck: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverName: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#475569',
    textAlign: 'center',
  },
  paperGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  paperOption: {
    width: '47%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  paperOptionSelected: {
    borderColor: '#6366f1',
    backgroundColor: '#eef2ff',
  },
  paperPreview: {
    width: '100%',
    height: 80,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#f8fafc',
  },
  paper_lined: {
    borderTopWidth: 1,
    borderTopColor: '#cbd5e1',
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
  },
  paper_grid: {
    backgroundColor: '#f1f5f9',
  },
  paper_dotted: {
    backgroundColor: '#fefefe',
  },
  paper_blank: {
    backgroundColor: '#ffffff',
  },
  paper_guided: {
    backgroundColor: '#f8fafc',
    borderLeftWidth: 1,
    borderLeftColor: '#cbd5e1',
  },
  paperName: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#475569',
  },
  paperNameSelected: {
    color: '#6366f1',
  },
  paperCheck: {
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
  previewSection: {
    marginTop: 16,
  },
  previewTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#1e293b',
    marginBottom: 16,
  },
  preview: {
    height: 200,
    borderRadius: 16,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewName: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
  },
  previewBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  previewBadgeText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: '#ffffff',
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
