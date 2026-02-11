import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useMedicines } from '../MedicineContext';

const QABox = ({ questions }) => {
  const { t } = useMedicines();

  if (!questions.length) {
    return (
      <Text style={styles.emptyText}>
        {t('noQuestions')}
      </Text>
    );
  }

  return (
    <View>
      {questions.map(item => (
        <View key={item.id} style={styles.qaCard}>

          {/* Question */}
          <View style={styles.questionBlock}>
            <Text style={styles.label}>{t('question')}</Text>
            <Text style={styles.questionText}>
              {item.question}
            </Text>
          </View>

          {/* Answer */}
          {item.answer && (
            <View style={styles.answerBlock}>
              <Text style={styles.answerLabel}>
                {t('doctorAnswer')}
              </Text>
              <Text style={styles.answerText}>
                {item.answer}
              </Text>
            </View>
          )}

        </View>
      ))}
    </View>
  );
};

export default QABox;

const styles = StyleSheet.create({
  qaCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',

  },

  questionBlock: {
    marginBottom: 12,
  },

  label: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 4,
  },

  questionText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#111827',
    fontWeight: '500',
  },

  answerBlock: {
    backgroundColor: '#f7f7f7',
    borderRadius: 14,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#9ca3af',
  },

  answerLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9ca3af',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  answerText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#2b2b2b',
  },

  emptyText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 40,
  },
});
