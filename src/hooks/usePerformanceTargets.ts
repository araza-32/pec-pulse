
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface PerformanceTarget {
  id: string;
  metric_name: string;
  target_value: number;
  warning_threshold: number;
  danger_threshold: number;
  created_at: string;
  updated_at: string;
}

export function usePerformanceTargets() {
  const queryClient = useQueryClient();

  const { data: targets = [], isLoading, error } = useQuery({
    queryKey: ['performance-targets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('performance_targets')
        .select('*')
        .order('metric_name');
      
      if (error) {
        console.error('Error fetching performance targets:', error);
        throw error;
      }
      
      return data as PerformanceTarget[];
    }
  });

  const updateTarget = useMutation({
    mutationFn: async (updatedTarget: Partial<PerformanceTarget> & { id: string }) => {
      const { data, error } = await supabase
        .from('performance_targets')
        .update({
          target_value: updatedTarget.target_value,
          warning_threshold: updatedTarget.warning_threshold,
          danger_threshold: updatedTarget.danger_threshold,
          updated_at: new Date().toISOString()
        })
        .eq('id', updatedTarget.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating performance target:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['performance-targets'] });
      toast({
        title: 'Success',
        description: 'Performance target updated successfully',
      });
    },
    onError: (error) => {
      console.error('Error updating target:', error);
      toast({
        title: 'Error',
        description: 'Failed to update performance target',
        variant: 'destructive',
      });
    }
  });

  const createTarget = useMutation({
    mutationFn: async (newTarget: Omit<PerformanceTarget, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('performance_targets')
        .insert({
          ...newTarget,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating performance target:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['performance-targets'] });
      toast({
        title: 'Success',
        description: 'Performance target created successfully',
      });
    },
    onError: (error) => {
      console.error('Error creating target:', error);
      toast({
        title: 'Error',
        description: 'Failed to create performance target',
        variant: 'destructive',
      });
    }
  });

  return {
    targets,
    isLoading,
    error,
    updateTarget,
    createTarget
  };
}
