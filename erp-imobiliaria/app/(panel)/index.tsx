import React from 'react';
import * as S from './styles'; // Importa tudo do arquivo de estilos
import { View } from 'react-native';

export default function Dashboard() {
  return (
    <S.Container>
      <S.Content>
        <S.Header>
          <S.Title>Dashboard</S.Title>
          <S.Subtitle>Visão geral do sistema</S.Subtitle>
        </S.Header>

        <S.Grid>
          <S.Card>
            <S.Subtitle>Imóveis Disponíveis</S.Subtitle>
            <S.Title>4</S.Title>
            <S.Subtitle style={{fontSize: 12}}>Ativos no sistema</S.Subtitle>
          </S.Card>

          <S.Card>
            <S.Subtitle>Vendas no Mês</S.Subtitle>
            <S.Title>2</S.Title>
            <S.Subtitle style={{fontSize: 12}}>R$ 3.780.000,00</S.Subtitle>
          </S.Card>

          <S.Card>
            <S.Subtitle>Leads Ativos</S.Subtitle>
            <S.Title>5</S.Title>
            <S.Subtitle style={{fontSize: 12}}>Em processo</S.Subtitle>
          </S.Card>
        </S.Grid>

      </S.Content>
    </S.Container>
  );
}