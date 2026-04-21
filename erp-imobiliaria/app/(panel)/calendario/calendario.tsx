import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, TextInput, Alert, useWindowDimensions, Platform } from 'react-native';
import { Plus, ChevronLeft, ChevronRight, Clock, X, Trash2 } from 'lucide-react-native';
import { theme } from '../../../theme';
import { getToken } from '../../auth'; // Importe seu helper de token
import * as S from './calendario.styles';

export default function Calendario() {
  const { width } = useWindowDimensions(); // Se não tiver, adicione o import
  
  // 1. ESTADOS (Sempre no topo)
  const [viewDate, setViewDate] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);
  const [visitasDoBanco, setVisitasDoBanco] = useState<any[]>([]);
  const [selectedVisitId, setSelectedVisitId] = useState<string | null>(null);

  // Estados do Formulário
  const [formData, setFormData] = useState({
    title: '',
    date: '', // Formato YYYY-MM-DD
    time: '', // Formato HH:mm
    client_id: '', // No futuro, isso será um Select
    property_id: '', // No futuro, isso será um Select
    description: '',
    status: 'Agendada'
  });
  
  const today = new Date();

  // 2. BUSCA DE DADOS
  const carregarVisitas = async () => {
    try {
      const token = getToken(); // Pega o token do seu storage
      console.log(token);
      const response = await fetch('http://localhost:3000/api/visitas', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const dados = await response.json();
      console.log(dados);
      setVisitasDoBanco(Array.isArray(dados) ? dados : []);
    } catch (error) {
      console.error("Erro ao carregar visitas:", error);
    }
  };

  useEffect(() => {
    carregarVisitas();
  }, [viewDate]); // Recarrega quando mudar o mês

  // Limpa o formulário para uma nova inserção
  const handleNewVisit = () => {
    setSelectedVisitId(null);
    setFormData({
      title: '',
      date: today.toISOString().split('T')[0],
      time: '10:00',
      client_id: '',
      property_id: '',
      description: '',
      status: 'Agendada'
    });
    setModalVisible(true);
  };

  // Preenche o formulário para edição
  const handleEditVisit = (visit: any) => {
    const visitDate = new Date(visit.date);
    setSelectedVisitId(visit.id);
    setFormData({
      title: visit.title || '',
      date: visitDate.toISOString().split('T')[0],
      time: visitDate.getUTCHours().toString().padStart(2, '0') + ':' + visitDate.getUTCMinutes().toString().padStart(2, '0'),
      client_id: visit.client_id,
      property_id: visit.property_id,
      description: visit.description || '',
      status: visit.status || 'Agendada'
    });
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.date || !formData.client_id || !formData.property_id) {
      return Alert.alert("Erro", "Preencha os campos obrigatórios (Título, Data, Cliente e Imóvel)");
    }

    try {
      const token = getToken();
      const method = selectedVisitId ? 'PUT' : 'POST';
      const url = selectedVisitId 
        ? `http://localhost:3000/api/visitas/${selectedVisitId}` 
        : `http://localhost:3000/api/visitas`;
 console.log(url);
      // Combina data e hora para o formato ISO do Postgres
      const combinedDateTime = new Date(`${formData.date}T${formData.time}:00Z`);

      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          ...formData,
          date: combinedDateTime.toISOString()
        })
      });

      if (response.ok) {
        Alert.alert("Sucesso", selectedVisitId ? "Agendamento atualizado!" : "Visita agendada!");
        setModalVisible(false);
        carregarVisitas();
      } else {
        const errorData = await response.json();
        Alert.alert("Erro", errorData.error || "Erro ao salvar");
      }
    } catch (error) {
      Alert.alert("Erro", "Falha na conexão com o servidor");
    }
  };

 

  // 3. LÓGICA DO CALENDÁRIO
  const calendarData = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    const days = [];

    for (let i = firstDayOfMonth; i > 0; i--) {
      days.push({ day: daysInPrevMonth - i + 1, month: 'prev', date: new Date(year, month - 1, daysInPrevMonth - i + 1) });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, month: 'current', date: new Date(year, month, i) });
    }
    const remainingSlots = 42 - days.length;
    for (let i = 1; i <= remainingSlots; i++) {
      days.push({ day: i, month: 'next', date: new Date(year, month + 1, i) });
    }
    return days;
  }, [viewDate]);

  const changeMonth = (offset: number) => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1));

 const executarExclusao = async () => {
    try {
      const token = getToken();
      const response = await fetch(`http://localhost:3000/api/visitas/${selectedVisitId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        setModalVisible(false);
        carregarVisitas();
      } else {
        const errorData = await response.json();
        Alert.alert("Erro", errorData.error || "Erro ao excluir");
      }
    } catch (error) {
      console.error("Erro ao excluir:", error);
    }
  };

  

 return (
    <S.Container>
      {/* HEADER */}
      <S.HeaderRow>
        <View>
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Calendário de Visitas</Text>
          <Text style={{ color: theme.colors.textLight }}>Gerencie sua agenda</Text>
        </View>
        <TouchableOpacity onPress={handleNewVisit} style={{ backgroundColor: '#0f172a', padding: 12, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Plus size={18} color="white" />
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Agendar Visita</Text>
        </TouchableOpacity>
      </S.HeaderRow>

      {/* GRID DO CALENDÁRIO */}
      <S.CalendarWrapper>
        <S.CalendarHeader>
          <TouchableOpacity onPress={() => changeMonth(-1)}><ChevronLeft color="white" /></TouchableOpacity>
          <S.MonthTitle style={{ textTransform: 'capitalize' }}>{viewDate.toLocaleString('pt-BR', { month: 'long' })} {viewDate.getFullYear()}</S.MonthTitle>
          <TouchableOpacity onPress={() => changeMonth(1)}><ChevronRight color="white" /></TouchableOpacity>
        </S.CalendarHeader>

        <S.WeekdaysRow>
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
            <S.WeekdayCell key={day}><S.WeekdayText>{day}</S.WeekdayText></S.WeekdayCell>
          ))}
        </S.WeekdaysRow>

        <S.DaysGrid>
          {calendarData.map((item, index) => {
            const isToday = item.date.toDateString() === today.toDateString();
            const isOtherMonth = item.month !== 'current';
            const dayVisits = visitasDoBanco.filter(v => new Date(v.date).toDateString() === item.date.toDateString());

            return (
              <S.DayCell key={index} isToday={isToday} isOtherMonth={isOtherMonth}>
                <S.DayNumber isToday={isToday}>{item.day}</S.DayNumber>
                <View style={{ flexDirection: 'column', gap: 2, marginTop: 4 }}>
                  {dayVisits.map(v => (
                    <TouchableOpacity key={v.id} onPress={() => handleEditVisit(v)} style={{ 
                      backgroundColor: v.status === 'Concluída' ? theme.colors.success : theme.colors.primary,
                      borderRadius: 4, padding: 2
                    }}>
                      <Text style={{ fontSize: 9, color: 'white' }} numberOfLines={1}>{v.title}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </S.DayCell>
            );
          })}
        </S.DaysGrid>
      </S.CalendarWrapper>

      {/* MODAL DE INSERIR / ALTERAR */}
      <Modal visible={modalVisible} animationType="fade" transparent>
        <S.ModalOverlay>
          <S.ModalContainer>
            <S.ModalHeader>
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{selectedVisitId ? 'Editar Visita' : 'Novo Agendamento'}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}><X size={20} color={theme.colors.textLight} /></TouchableOpacity>
            </S.ModalHeader>

            <ScrollView showsVerticalScrollIndicator={false}>
              <S.InputGroup>
                <S.Label>Título *</S.Label>
                <S.StyledInput value={formData.title} onChangeText={(t) => setFormData({...formData, title: t})} placeholder="Ex: Visita Casa Amarela" />
              </S.InputGroup>

              <S.Row>
                <S.InputGroup style={{ flex: 1 }}>
                  <S.Label>Data *</S.Label>
                  <S.StyledInput value={formData.date} onChangeText={(t) => setFormData({...formData, date: t})} placeholder="YYYY-MM-DD" />
                </S.InputGroup>
                <S.InputGroup style={{ flex: 1 }}>
                  <S.Label>Hora *</S.Label>
                  <S.StyledInput value={formData.time} onChangeText={(t) => setFormData({...formData, time: t})} placeholder="HH:mm" />
                </S.InputGroup>
              </S.Row>

              <S.InputGroup>
                <S.Label>ID do Cliente * (UUID)</S.Label>
                <S.StyledInput value={formData.client_id} onChangeText={(t) => setFormData({...formData, client_id: t})} placeholder="Cole o ID do cliente" />
              </S.InputGroup>

              <S.InputGroup>
                <S.Label>ID do Imóvel * (UUID)</S.Label>
                <S.StyledInput value={formData.property_id} onChangeText={(t) => setFormData({...formData, property_id: t})} placeholder="Cole o ID do imóvel" />
              </S.InputGroup>

              <S.InputGroup>
                <S.Label>Status</S.Label>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                   <TouchableOpacity onPress={() => setFormData({...formData, status: 'Agendada'})} style={{ padding: 8, borderRadius: 8, backgroundColor: formData.status === 'Agendada' ? theme.colors.primary : '#eee' }}>
                      <Text style={{ color: formData.status === 'Agendada' ? 'white' : 'black' }}>Agendada</Text>
                   </TouchableOpacity>
                   <TouchableOpacity onPress={() => setFormData({...formData, status: 'Concluída'})} style={{ padding: 8, borderRadius: 8, backgroundColor: formData.status === 'Concluída' ? theme.colors.success : '#eee' }}>
                      <Text style={{ color: formData.status === 'Concluída' ? 'white' : 'black' }}>Concluída</Text>
                   </TouchableOpacity>
                </View>
              </S.InputGroup>

             <S.Footer>
  {selectedVisitId && (
    <TouchableOpacity onPress={executarExclusao} style={{ padding: 12, backgroundColor: '#fee2e2', borderRadius: 8, marginRight: 'auto' }}>
      <Trash2 size={20} color={theme.colors.danger} />
    </TouchableOpacity>
  )}
  <TouchableOpacity onPress={handleSave} style={{ backgroundColor: theme.colors.primary, padding: 12, borderRadius: 8, paddingHorizontal: 30 }}>
    <Text style={{ color: 'white', fontWeight: 'bold' }}>Salvar</Text>
  </TouchableOpacity>
</S.Footer>
            </ScrollView>
          </S.ModalContainer>
        </S.ModalOverlay>
      </Modal>
    </S.Container>
  );
}