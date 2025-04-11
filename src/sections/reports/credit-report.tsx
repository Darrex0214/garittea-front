import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { Credit } from 'src/types/credit';

// ----------------------------------------------------------------------

// Registrar fuentes si es necesario
Font.register({
  family: 'Roboto',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf',
});

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Roboto',
    padding: 30,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#000000',
  },
  header: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: 'right',
    color: '#666666',
  },
  tableContainer: {
    marginTop: 20,
    border: '1pt solid #000000',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    borderBottomStyle: 'solid',
    backgroundColor: '#f5f5f5',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    borderBottomStyle: 'solid',
  },
  column: {
    padding: 8,
    marginRight: 8,
    borderRightWidth: 1,
    borderRightColor: '#cccccc',
    borderRightStyle: 'solid',
  },
  columnLast: {
    borderRightWidth: 0,
    marginRight: 0,
  },
  columnId: {
    width: '10%',
  },
  columnUser: {
    width: '25%',
  },
  columnApplicant: {
    width: '25%',
  },
  columnDebt: {
    width: '20%',
  },
  columnState: {
    width: '20%',
  },
  text: {
    fontSize: 10,
    color: '#000000',
  },
  textRight: {
    textAlign: 'right',
  },
  headerText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000000',
  },
});

// ----------------------------------------------------------------------

type CreditReportProps = {
  credits: Credit[];
  currentDate: string;
  getStateLabel: (state: number) => string;
};

export function CreditReport({ credits, currentDate, getStateLabel }: CreditReportProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Reporte Crediticio</Text>
        <Text style={styles.header}>Fecha de impresión: {currentDate}</Text>

        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <View style={[styles.column, styles.columnId]}>
              <Text style={styles.headerText}>ID</Text>
            </View>
            <View style={[styles.column, styles.columnUser]}>
              <Text style={styles.headerText}>Usuario</Text>
            </View>
            <View style={[styles.column, styles.columnApplicant]}>
              <Text style={styles.headerText}>Solicitante</Text>
            </View>
            <View style={[styles.column, styles.columnDebt]}>
              <Text style={[styles.headerText, styles.textRight]}>Deuda</Text>
            </View>
            <View style={[styles.column, styles.columnState, styles.columnLast]}>
              <Text style={styles.headerText}>Estado</Text>
            </View>
          </View>

          {credits.map((credit) => (
            <View key={credit.id} style={styles.tableRow}>
              <View style={[styles.column, styles.columnId]}>
                <Text style={styles.text}>{credit.id}</Text>
              </View>
              <View style={[styles.column, styles.columnUser]}>
                <Text style={styles.text}>{credit.user.name}</Text>
              </View>
              <View style={[styles.column, styles.columnApplicant]}>
                <Text style={styles.text}>{credit.applicant.name}</Text>
              </View>
              <View style={[styles.column, styles.columnDebt]}>
                <Text style={[styles.text, styles.textRight]}>${credit.debtAmount.toLocaleString()}</Text>
              </View>
              <View style={[styles.column, styles.columnState, styles.columnLast]}>
                <Text style={styles.text}>{getStateLabel(credit.state)}</Text>
              </View>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
} 