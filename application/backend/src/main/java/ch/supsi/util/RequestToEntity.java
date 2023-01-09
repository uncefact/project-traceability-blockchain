package ch.supsi.util;

import java.beans.IntrospectionException;
import java.beans.PropertyDescriptor;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class RequestToEntity {

    /**
     * This method will transfer to "entity" the field of the request that are filled
     * @param request
     * @param entity
     * @param <T>
     * @throws IllegalAccessException
     * @throws IntrospectionException
     * @throws InvocationTargetException
     */
    public static <T> void map(T request, T entity) throws IllegalAccessException, IntrospectionException, InvocationTargetException {
        Field[] fields = request.getClass().getDeclaredFields();
        updateNonEmptyFields(fields, entity, request, true);
    }

    private static <T> void updateNonEmptyFields(Field[] fields, T entity, T request, boolean isChild) throws IllegalAccessException, IntrospectionException, InvocationTargetException {
        PropertyDescriptor setterDescriptor;
        Method setter;
        List<Field> entityFields = new ArrayList<>();
        if (isChild){
            entityFields.addAll(Arrays.asList(entity.getClass().getSuperclass().getDeclaredFields()));
            entityFields.addAll(Arrays.asList(entity.getClass().getDeclaredFields()));
        }
        else {
            entityFields = Arrays.asList(entity.getClass().getDeclaredFields());
        }
        for (Field field : fields){
            field.setAccessible(true);
            Object fieldValue = field.get(request);
            if (fieldValue != null && fieldValue != ""){
                if (doesObjectFieldsHasField(entityFields, field.getName())) {
                    setterDescriptor = new PropertyDescriptor(field.getName(), entity.getClass());
                    setter = setterDescriptor.getWriteMethod();
                    setter.invoke(entity, fieldValue);
                }
            }
        }
    }

    private static boolean doesObjectFieldsHasField(List<Field> entityFields, String fieldName) {
        for (Field field : entityFields) {
            field.setAccessible(true);
            if (field.getName().equals(fieldName))
                return true;
        }
        return false;
    }
}
