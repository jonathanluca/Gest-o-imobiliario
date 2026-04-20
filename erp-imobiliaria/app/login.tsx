import React, { useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react-native';

import { theme } from '../theme';
import { saveAuth } from './auth';
import * as S from './login.styles';

const API_URL = 'http://localhost:3000';

const FEATURES = [
  'Gestão completa de imóveis',
  'Controle de vendas e comissões',
  'Pipeline de leads integrado',
  'Dashboard com relatórios em tempo real',
];

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focused, setFocused] = useState<string | null>(null);

  async function handleSubmit() {
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Preencha e-mail e senha.');
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Credenciais inválidas.');
        return;
      }
      saveAuth(data.token, data.user);
      router.replace('/');
    } catch {
      setError('Não foi possível conectar ao servidor. Verifique se a API está rodando na porta 3000.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <S.Screen>
      {/* ── PAINEL ESQUERDO ─────────────────────────────────────── */}
      <S.Brand>
        <S.BrandTop>
          <S.BrandLogo>🏢 ERP Imobiliário</S.BrandLogo>
          <S.BrandTagline>Gestão completa para sua imobiliária</S.BrandTagline>
        </S.BrandTop>

        <S.BrandCenter>
          <S.BrandHeadline>
            Gerencie seus{'\n'}imóveis com{'\n'}eficiência
          </S.BrandHeadline>
          <S.BrandSub>
            Controle imóveis, clientes, vendas e leads em um só lugar.
          </S.BrandSub>
          <S.FeatureList>
            {FEATURES.map(f => (
              <S.FeatureItem key={f}>
                <S.FeatureDot />
                <S.FeatureText>{f}</S.FeatureText>
              </S.FeatureItem>
            ))}
          </S.FeatureList>
        </S.BrandCenter>

        <S.BrandFooter>© 2026 ERP Imobiliário</S.BrandFooter>
      </S.Brand>

      {/* ── PAINEL DIREITO ──────────────────────────────────────── */}
      <S.FormPanel>
        <S.FormInner>
          <S.MobileLogo>🏢 ERP Imobiliário</S.MobileLogo>

          <S.FormCard>
            <S.FormTitle>Bem-vindo de volta</S.FormTitle>
            <S.FormSubtitle>Entre com suas credenciais para acessar o painel</S.FormSubtitle>

            <S.Label>E-mail</S.Label>
            <S.InputWrapper focused={focused === 'email'}>
              <Mail size={17} color={focused === 'email' ? theme.colors.primary : theme.colors.textLight} />
              <S.StyledInput
                placeholder="seu@email.com"
                value={email}
                onChangeText={setEmail}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused(null)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </S.InputWrapper>

            <S.Label>Senha</S.Label>
            <S.InputWrapper focused={focused === 'password'}>
              <Lock size={17} color={focused === 'password' ? theme.colors.primary : theme.colors.textLight} />
              <S.StyledInput
                placeholder="Sua senha"
                value={password}
                onChangeText={setPassword}
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused(null)}
                secureTextEntry={!showPassword}
              />
              <S.PasswordToggle onPress={() => setShowPassword(v => !v)}>
                {showPassword
                  ? <EyeOff size={17} color={theme.colors.textLight} />
                  : <Eye size={17} color={theme.colors.textLight} />}
              </S.PasswordToggle>
            </S.InputWrapper>

            {error ? (
              <S.ErrorBox>
                <AlertCircle size={15} color="#dc2626" />
                <S.ErrorText>{error}</S.ErrorText>
              </S.ErrorBox>
            ) : null}

            <S.LoginButton onPress={handleSubmit} disabled={loading} loading={loading}>
              {loading
                ? <ActivityIndicator color="white" size="small" />
                : <S.LoginButtonText>Entrar no painel</S.LoginButtonText>}
            </S.LoginButton>

            <S.Footer>© 2026 ERP Imobiliário · Todos os direitos reservados</S.Footer>
          </S.FormCard>
        </S.FormInner>
      </S.FormPanel>
    </S.Screen>
  );
}
