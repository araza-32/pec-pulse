
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Workbody } from '@/types';

export type MetricType = 
  | 'attendance_rate'
  | 'action_item_completion'
  | 'doc_submission_timeliness'
  | 'deliverable_quality_score'
  | 'average_decision_turnaround'
  | 'meetings_held'
  | 'member_turnover'
  | 'recommendations_issued'
  | 'cross_workbody_collaborations';

export type TimePeriod = '30days' | 'quarter' | 'year' | 'custom';

export interface PerformanceTarget {
  id: string;
  metric_name: MetricType;
  target_value: number;
  warning_threshold: number;
  danger_threshold: number;
}

export interface MetricStatus {
  value: number;
  status: 'good' | 'warning' | 'danger';
  trend: 'up' | 'down' | 'stable';
}

export interface WorkbodyPerformance extends Workbody {
  performanceMetrics: {
    [K in MetricType]: MetricStatus;
  };
}

export function usePerformanceMetrics(timePeriod: TimePeriod = 'quarter') {
  const queryClient = useQueryClient();

  // Fetch performance targets
  const { data: targets = [], isLoading: targetsLoading } = useQuery({
    queryKey: ['performance-targets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('performance_targets')
        .select('*');
      
      if (error) throw error;
      return data as PerformanceTarget[];
    }
  });

  // Fetch workbodies with performance metrics
  const { data: workbodies = [], isLoading: workbodiesLoading } = useQuery({
    queryKey: ['workbodies-performance', timePeriod],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workbodies')
        .select(`
          *,
          workbody_members (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  // Calculate performance status based on targets
  const calculateMetricStatus = (value: number, metricName: MetricType): MetricStatus => {
    const target = targets.find(t => t.metric_name === metricName);
    if (!target) return { value, status: 'good', trend: 'stable' };

    let status: 'good' | 'warning' | 'danger' = 'good';
    
    if (metricName === 'average_decision_turnaround') {
      // For turnaround time, lower is better
      if (value >= target.danger_threshold) status = 'danger';
      else if (value >= target.warning_threshold) status = 'warning';
    } else {
      // For other metrics, higher is better
      if (value < target.danger_threshold) status = 'danger';
      else if (value < target.warning_threshold) status = 'warning';
    }

    return { value, status, trend: 'stable' }; // Mock trend for now
  };

  // Transform workbodies with performance metrics
  const workbodiesWithPerformance: WorkbodyPerformance[] = workbodies.map(wb => ({
    ...wb,
    id: wb.id,
    name: wb.name,
    type: wb.type as 'committee' | 'working-group' | 'task-force',
    description: wb.description,
    createdDate: wb.created_date,
    endDate: wb.end_date,
    termsOfReference: wb.terms_of_reference,
    totalMeetings: wb.total_meetings || 0,
    meetingsThisYear: wb.meetings_this_year || 0,
    actionsAgreed: wb.actions_agreed || 0,
    actionsCompleted: wb.actions_completed || 0,
    members: (wb.workbody_members || []).map(member => ({
      id: member.id,
      name: member.name,
      role: member.role,
      email: member.email,
      phone: member.phone,
      hasCV: member.has_cv || false
    })),
    performanceMetrics: {
      attendance_rate: calculateMetricStatus(wb.attendance_rate || 0, 'attendance_rate'),
      action_item_completion: calculateMetricStatus(wb.action_item_completion || 0, 'action_item_completion'),
      doc_submission_timeliness: calculateMetricStatus(wb.doc_submission_timeliness || 0, 'doc_submission_timeliness'),
      deliverable_quality_score: calculateMetricStatus(wb.deliverable_quality_score || 0, 'deliverable_quality_score'),
      average_decision_turnaround: calculateMetricStatus(wb.average_decision_turnaround || 0, 'average_decision_turnaround'),
      meetings_held: calculateMetricStatus(wb.meetings_held || 0, 'meetings_held'),
      member_turnover: calculateMetricStatus(wb.member_turnover || 0, 'member_turnover'),
      recommendations_issued: calculateMetricStatus(wb.recommendations_issued || 0, 'recommendations_issued'),
      cross_workbody_collaborations: calculateMetricStatus(wb.cross_workbody_collaborations || 0, 'cross_workbody_collaborations')
    }
  }));

  // Update performance targets
  const updateTargets = useMutation({
    mutationFn: async (newTargets: Partial<PerformanceTarget>[]) => {
      const updates = newTargets.map(target => 
        supabase
          .from('performance_targets')
          .upsert(target)
      );
      
      await Promise.all(updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['performance-targets'] });
    }
  });

  // Get top performers for a specific metric
  const getTopPerformers = (metric: MetricType, limit: number = 5) => {
    return [...workbodiesWithPerformance]
      .sort((a, b) => {
        const aValue = a.performanceMetrics[metric].value;
        const bValue = b.performanceMetrics[metric].value;
        
        if (metric === 'average_decision_turnaround') {
          return aValue - bValue; // Lower is better
        }
        return bValue - aValue; // Higher is better
      })
      .slice(0, limit);
  };

  // Get alerts (metrics below target)
  const getAlerts = () => {
    const alerts: Array<{
      workbody: WorkbodyPerformance;
      metric: MetricType;
      status: MetricStatus;
    }> = [];

    workbodiesWithPerformance.forEach(workbody => {
      Object.entries(workbody.performanceMetrics).forEach(([metricName, status]) => {
        if (status.status === 'danger') {
          alerts.push({
            workbody,
            metric: metricName as MetricType,
            status
          });
        }
      });
    });

    return alerts;
  };

  return {
    workbodies: workbodiesWithPerformance,
    targets,
    isLoading: workbodiesLoading || targetsLoading,
    updateTargets,
    getTopPerformers,
    getAlerts
  };
}
