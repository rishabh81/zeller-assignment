import React, { forwardRef } from "react";
import { Control, Controller, FieldError, RegisterOptions } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

interface IWithFormFieldProps {
  name: string;
  control: Control<any>;
  rules?: RegisterOptions;
  error?: FieldError;
  label?: string;
  required?: boolean;
}

type TWithFormFieldProps<T> =
  Omit<T, "value" | "onChangeText"> & IWithFormFieldProps;

export function withFormField<T extends object>(
  WrappedComponent: React.ComponentType<T>
) {
  return forwardRef<any, TWithFormFieldProps<T>>(
    (props, ref) => {
      const typedProps = props as TWithFormFieldProps<T>;

      const {
        name,
        control,
        rules,
        error,
        label,
        required,
        ...restProps
      } = typedProps;

      return (
        <View style={styles.field}>
            {label &&(<Text style={styles.label}>{label}</Text>)}
            <Controller
                control={control}
                name={name}
                rules={rules}
                render={({field:{value, onChange, onBlur}}) => (
                    <WrappedComponent
                        {...restProps as any}
                        ref={ref}
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        error={error}
                    />
                )}
            />
            {error && <Text style={styles.errorText}>{error.message}</Text>}
        </View>
      );
    }
  );
}

const styles = StyleSheet.create({
    field: {
        marginBottom: 20,
    },
    label: {
        fontSize:16,
        marginBottom:8,
    },
    errorText: {
        color: colors.error,
        fontSize: 16,
        marginBottom: 8,
    }
})
