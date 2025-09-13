import React from 'react';
import styled from 'styled-components';

const TermsContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 120px 20px 60px 20px;
`;

const TermsContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: white;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  color: #1e293b;
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 30px;
`;

const Section = styled.section`
  margin-bottom: 30px;
`;

const SectionTitle = styled.h2`
  color: #1e293b;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 15px;
  border-bottom: 2px solid #ffd700;
  padding-bottom: 8px;
`;

const Paragraph = styled.p`
  color: #4a5568;
  line-height: 1.7;
  margin-bottom: 15px;
  font-size: 1rem;
`;

const List = styled.ul`
  color: #4a5568;
  line-height: 1.7;
  margin-bottom: 15px;
  padding-left: 20px;
`;

const ListItem = styled.li`
  margin-bottom: 8px;
`;

const Highlight = styled.span`
  color: #1e293b;
  font-weight: 600;
`;

const ContactInfo = styled.div`
  background: #f7fafc;
  padding: 20px;
  border-radius: 10px;
  border-left: 4px solid #ffd700;
  margin-top: 30px;
`;

const TermsPage: React.FC = () => {
  return (
    <TermsContainer>
      <TermsContent>
        <Title>Условия использования</Title>
        
        <Section>
          <Paragraph>
            <strong>Дата вступления в силу:</strong> 1 января 2024 года
          </Paragraph>
          <Paragraph>
            Добро пожаловать на сайт туристической компании "Сочи Трэвел". Используя наш сайт и услуги, 
            вы соглашаетесь с настоящими условиями использования. Пожалуйста, внимательно ознакомьтесь с ними.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>1. Общие положения</SectionTitle>
          <Paragraph>
            Настоящие условия использования регулируют отношения между туристической компанией "Сочи Трэвел" 
            (далее — "Компания") и пользователями нашего сайта (далее — "Пользователи").
          </Paragraph>
          <Paragraph>
            Используя наш сайт, вы подтверждаете, что:
          </Paragraph>
          <List>
            <ListItem>Вам исполнилось 18 лет или вы действуете с согласия родителя/опекуна</ListItem>
            <ListItem>Вы предоставляете достоверную и полную информацию</ListItem>
            <ListItem>Вы не будете использовать сайт для незаконных целей</ListItem>
            <ListItem>Вы согласны с настоящими условиями использования</ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>2. Услуги компании</SectionTitle>
          <Paragraph>
            "Сочи Трэвел" предоставляет следующие услуги:
          </Paragraph>
          <List>
            <ListItem>Бронирование туров и экскурсий</ListItem>
            <ListItem>Бронирование отелей и гостиниц</ListItem>
            <ListItem>Организация трансферов</ListItem>
            <ListItem>Консультации по туристическим направлениям</ListItem>
            <ListItem>Оформление туристических документов</ListItem>
          </List>
          <Paragraph>
            Все услуги предоставляются в соответствии с действующим законодательством РФ 
            и международными стандартами туристической индустрии.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>3. Бронирование и оплата</SectionTitle>
          <Paragraph>
            <Highlight>Бронирование:</Highlight> Бронирование услуг осуществляется через наш сайт 
            или по телефону. Подтверждение бронирования высылается на указанный email.
          </Paragraph>
          <Paragraph>
            <Highlight>Оплата:</Highlight> Оплата производится банковскими картами, электронными 
            платежами или наличными в офисе компании. Полная оплата должна быть произведена 
            не позднее 3 дней до начала тура.
          </Paragraph>
          <Paragraph>
            <Highlight>Цены:</Highlight> Все цены указаны в рублях РФ и включают НДС. 
            Компания оставляет за собой право изменять цены в случае изменения курсов валют 
            или тарифов поставщиков услуг.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>4. Отмена и возврат</SectionTitle>
          <Paragraph>
            <Highlight>Отмена тура:</Highlight>
          </Paragraph>
          <List>
            <ListItem>Более 30 дней до начала — возврат 100% стоимости</ListItem>
            <ListItem>15-30 дней до начала — возврат 70% стоимости</ListItem>
            <ListItem>7-14 дней до начала — возврат 50% стоимости</ListItem>
            <ListItem>Менее 7 дней до начала — возврат не производится</ListItem>
          </List>
          <Paragraph>
            <Highlight>Форс-мажор:</Highlight> В случае форс-мажорных обстоятельств 
            (стихийные бедствия, военные действия, эпидемии) возврат производится 
            в полном объеме или предлагается альтернативная дата.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>5. Ответственность сторон</SectionTitle>
          <Paragraph>
            <Highlight>Ответственность компании:</Highlight>
          </Paragraph>
          <List>
            <ListItem>Обеспечение качества предоставляемых услуг</ListItem>
            <ListItem>Соблюдение условий договора</ListItem>
            <ListItem>Предоставление достоверной информации об услугах</ListItem>
            <ListItem>Обеспечение безопасности туристов</ListItem>
          </List>
          <Paragraph>
            <Highlight>Ответственность туриста:</Highlight>
          </Paragraph>
          <List>
            <ListItem>Соблюдение правил поведения в местах размещения</ListItem>
            <ListItem>Своевременная оплата услуг</ListItem>
            <ListItem>Предоставление достоверных документов</ListItem>
            <ListItem>Соблюдение местных законов и обычаев</ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>6. Персональные данные</SectionTitle>
          <Paragraph>
            Компания собирает и обрабатывает персональные данные в соответствии с 
            Федеральным законом "О персональных данных" и нашей Политикой конфиденциальности.
          </Paragraph>
          <Paragraph>
            Мы используем ваши данные для:
          </Paragraph>
          <List>
            <ListItem>Оформления туристических документов</ListItem>
            <ListItem>Бронирования услуг</ListItem>
            <ListItem>Связи с вами по вопросам тура</ListItem>
            <ListItem>Улучшения качества обслуживания</ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>7. Интеллектуальная собственность</SectionTitle>
          <Paragraph>
            Весь контент сайта (тексты, изображения, логотипы, дизайн) является 
            интеллектуальной собственностью компании "Сочи Трэвел" и защищен 
            авторским правом.
          </Paragraph>
          <Paragraph>
            Запрещается копирование, распространение или использование контента 
            без письменного разрешения компании.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>8. Изменение условий</SectionTitle>
          <Paragraph>
            Компания оставляет за собой право изменять настоящие условия использования. 
            Изменения вступают в силу с момента их публикации на сайте.
          </Paragraph>
          <Paragraph>
            Продолжение использования сайта после внесения изменений означает 
            согласие с новыми условиями.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>9. Разрешение споров</SectionTitle>
          <Paragraph>
            Все споры, возникающие между сторонами, разрешаются путем переговоров. 
            В случае невозможности достижения соглашения спор разрешается в судебном 
            порядке по месту нахождения компании.
          </Paragraph>
          <Paragraph>
            К отношениям сторон применяется законодательство Российской Федерации.
          </Paragraph>
        </Section>

        <ContactInfo>
          <SectionTitle>Контактная информация</SectionTitle>
          <Paragraph>
            <strong>Туристическая компания "Сочи Трэвел"</strong>
          </Paragraph>
          <Paragraph>
            <strong>Адрес:</strong> г. Сочи, ул. Туристическая, д. 123
          </Paragraph>
          <Paragraph>
            <strong>Телефон:</strong> +7 (862) 123-45-67
          </Paragraph>
          <Paragraph>
            <strong>Email:</strong> info@sochi-travel.ru
          </Paragraph>
          <Paragraph>
            <strong>Режим работы:</strong> Пн-Пт: 9:00-18:00, Сб: 10:00-16:00, Вс: выходной
          </Paragraph>
        </ContactInfo>

        <Paragraph style={{ textAlign: 'center', marginTop: '30px', fontSize: '0.9rem', color: '#666' }}>
          Последнее обновление: 1 января 2024 года
        </Paragraph>
      </TermsContent>
    </TermsContainer>
  );
};

export default TermsPage;
