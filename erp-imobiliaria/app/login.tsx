import React, { useState } from 'react';
import { View, TextInput, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Mail, Lock, Eye, EyeOff, Building2 } from 'lucide-react-native';

import { theme } from '../theme';
import { saveAuth } from './auth';
import * as S from './login.styles';

const API_URL = 'http://localhost:3000';

type Mode = 'login' | 'register';

export default function Login() {
  const router = useRouter();

  const [mode, setMode] = useState<Mode>('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [focusedField, setFocusedField] = useState<string | null>(null);

  async function handleSubmit() {
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Preencha e-mail e senha.');
      return;
    }
    if (mode === 'register' && !fullName.trim()) {
      setError('Preencha seu nome completo.');
      return;
    }

    try {
      setLoading(true);
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const body: any = { email: email.trim(), password };
      if (mode === 'register') body.full_name = fullName.trim();

      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Ocorreu um erro. Tente novamente.');
        return;
      }

      if (mode === 'register') {
        setMode('login');
        setError('');
        setFullName('');
        setPassword('');
        return;
      }

      saveAuth(data.token, data.user);
      router.replace('/');
    } catch {
      setError('Não foi possível conectar ao servidor. Verifique se a API está rodando.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <S.Screen>
      {/* ── PAINEL ESQUERDO (desktop) ─────────────────────────── */}
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
            Controle imóveis, clientes, vendas e leads{'\n'}em um só lugar. Simples e poderoso.
          </S.BrandSub>
        </S.BrandCenter>

        <S.BrandStats>
          <S.StatBlock>
            <S.StatNumber>+500</S.StatNumber>
            <S.StatLabel>Imóveis gerenciados</S.StatLabel>
          </S.StatBlock>
          <S.StatBlock>
            <S.StatNumber>+120</S.StatNumber>
            <S.StatLabel>Corretores ativos</S.StatLabel>
          </S.StatBlock>
          <S.StatBlock>
            <S.StatNumber>98%</S.StatNumber>
            <S.StatLabel>Satisfação</S.StatLabel>
          </S.StatBlock>
        </S.BrandStats>
      </S.Brand>

      {/* ── PAINEL DIREITO (formulário) ───────────────────────── */}
      <S.FormPanel>
        <S.FormInner>
          <S.MobileLogo>🏢 ERP Imobiliário</S.MobileLogo>

          <S.FormCard>
            <S.FormTitle>
              {mode === 'login' ? 'Bem-vindo de volta' : 'Criar conta'}
            </S.FormTitle>
            <S.FormSubtitle>
              {mode === 'login'
                ? 'Entre com suas credenciais para acessar o painel'
                : 'Preencha os dados abaixo para criar sua conta'}
            </S.FormSubtitle>

            {/* Campo nome (só no register) */}
            {mode === 'register' && (
              <>
                <S.Label>Nome completo</S.Label>
                <S.InputWrapper focused={focusedField === 'name'}>
                  <Building2 size={18} color={theme.colors.textLight} />
                  <S.StyledInput
                    placeholder="Seu nome completo"
                    value={fullName}
                    onChangeText={setFullName}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    autoCapitalize="words"
                  />
                </S.InputWrapper>
              </>
            )}

            {/* Campo e-mail */}
            <S.Label>E-mail</S.Label>
            <S.InputWrapper focused={focusedField === 'email'}>
              <Mail size={18} color={theme.colors.textLight} />
              <S.StyledInput
                placeholder="seu@email.com"
                value={email}
                onChangeText={setEmail}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </S.InputWrapper>

            {/* Campo senha */}
            <S.Label>Senha</S.Label>
            <S.InputWrapper focused={focusedField === 'password'}>
              <Lock size={18} color={theme.colors.textLight} />
              <S.StyledInput
                placeholder={mode === 'register' ? 'Mínimo 6 caracteres' : 'Sua senha'}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                secureTextEntry={!showPassword}
              />
              <S.PasswordToggle onPress={() => setShowPassword(v => !v)}>
                {showPassword
                  ? <EyeOff size={18} color={theme.colors.textLight} />
                  : <Eye size={18} color={theme.colors.textLight} />}
              </S.PasswordToggle>
            </S.InputWrapper>

            {/* Mensagem de erro */}
            {error ? (
              <S.ErrorBox>
                <S.ErrorText>{error}</S.ErrorText>
              </S.ErrorBox>
            ) : null}

            {/* Botão principal */}
            <S.LoginButton onPress={handleSubmit} disabled={loading} loading={loading}>
              {loading
                ? <ActivityIndicator color="white" size="small" />
                : <S.LoginButtonText>
                    {mode === 'login' ? 'Entrar' : 'Criar conta'}
                  </S.LoginButtonText>}
            </S.LoginButton>

            {/* Divisor */}
            <S.Divider>
              <S.DividerLine />
              <S.DividerText>ou</S.DividerText>
              <S.DividerLine />
            </S.Divider>

            {/* Alternar modo */}
            <S.RegisterLink onPress={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}>
              <S.RegisterLinkText>
                {mode === 'login'
                  ? 'Não tem conta? Criar agora'
                  : 'Já tenho uma conta — Entrar'}
              </S.RegisterLinkText>
            </S.RegisterLink>

            <S.Footer>© 2026 ERP Imobiliário · Todos os direitos reservados</S.Footer>
          </S.FormCard>
        </S.FormInner>
      </S.FormPanel>
    </S.Screen>
  );
}
