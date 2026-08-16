package za.ac.cput.communitystore.service;

import java.util.List;

public interface IService<T, ID> {

    T create(T entity);

    T read(ID id);

    T update(T entity);

    void delete(ID id);

    List<T> getAll();
}
