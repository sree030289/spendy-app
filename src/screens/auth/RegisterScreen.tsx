import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CountryPicker, { Country } from 'react-native-country-picker-modal';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common/Button';
import { BiometricService } from '@/services/biometric';
import { COUNTRIES } from '@/constants/countries';

export default function RegisterScreen() {
  const { theme } = useTheme();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showBiometricPrompt, setShowBiometricPrompt] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    country: 'AU',
  });

  const selectedCountry = COUNTRIES.find(c => c.code === formData.country) || COUNTRIES[0];

  const handleRegister = async () => {
    if (!formData.fullName || !formData.email || !formData.mobile || !formData.password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const biometricAvailable = await BiometricService.isAvailable();
      if (biometricAvailable) {
        setShowBiometricPrompt(true);
      } else {
        await completeRegistration(false);
      }
    } catch (error) {
      Alert.alert('Registration Failed', 'Please try again');
    } finally {
      setLoading(false);
    }
  };

  const completeRegistration = async (biometricEnabled: boolean) => {
    const userData = {
      ...formData,
      currency: selectedCountry.currency,
      biometricEnabled,
    };
    
    await register(userData as any);
  };

  const BiometricPrompt = () => (
    <View style={[styles.modal, { backgroundColor: theme.colors.background }]}>
      <View style={styles.biometricContent}>
        <Ionicons name="finger-print" size={64} color={theme.colors.primary} />
        <Text style={[styles.biometricTitle, { color: theme.colors.text }]}>
          Enable Biometric Login?
        </Text>
        <Text style={[styles.biometricSubtitle, { color: theme.colors.textSecondary }]}>
          Use Face ID or Fingerprint for quick and secure access
        </Text>
        <View style={styles.biometricButtons}>
          <Button
            title="Enable"
            onPress={() => {
              setShowBiometricPrompt(false);
              completeRegistration(true);
            }}
            style={styles.biometricButton}
          />
          <Button
            title="Not Now"
            onPress={() => {
              setShowBiometricPrompt(false);
              completeRegistration(false);
            }}
            variant="outline"
            style={styles.biometricButton}
          />
        </View>
      </View>
    </View>
  );

  if (showBiometricPrompt) {
    return <BiometricPrompt />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Create Account</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Join Spendy to track and split expenses
          </Text>

          <View style={styles.form}>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                color: theme.colors.text 
              }]}
              placeholder="Full Name"
              placeholderTextColor={theme.colors.textSecondary}
              value={formData.fullName}
              onChangeText={(text) => setFormData({ ...formData, fullName: text })}
            />

            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                color: theme.colors.text 
              }]}
              placeholder="Email"
              placeholderTextColor={theme.colors.textSecondary}
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View style={styles.phoneContainer}>
              <View style={[styles.countryCode, { 
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border 
              }]}>
                <Text style={{ color: theme.colors.text }}>
                  {selectedCountry.flag} {selectedCountry.phoneCode}
                </Text>
              </View>
              <TextInput
                style={[styles.phoneInput, { 
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                  color: theme.colors.text 
                }]}
                placeholder="Mobile Number"
                placeholderTextColor={theme.colors.textSecondary}
                value={formData.mobile}
                onChangeText={(text) => setFormData({ ...formData, mobile: text })}
                keyboardType="phone-pad"
              />
            </View>

            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                color: theme.colors.text 
              }]}
              placeholder="Password"
              placeholderTextColor={theme.colors.textSecondary}
              value={formData.password}
              onChangeText={(text) => setFormData({ ...formData, password: text })}
              secureTextEntry
            />

            <Button
              title="Create Account"
              onPress={handleRegister}
              loading={loading}
              style={styles.registerButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}