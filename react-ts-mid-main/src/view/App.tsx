import React, { useEffect, useRef, useState, useCallback } from 'react';
import '../style/App.css';
import { asyncGet, asyncDelete, asyncPost, asyncPut } from '../utils/fetch';
import { api } from '../enum/api';
import { Student } from '../interface/Student';
import { resp } from '../interface/resp';

function App(): JSX.Element {
  const [students, setStudents] = useState<Student[]>([]);
  const [formData, setFormData] = useState({
    id: '',
    account: '',
    name: '',
    department: '',
    grade: '',
    Class: '',
    Email: '',
    findId: '',
    newName: '',
    searchId: '',
  });
  const [searchedStudent, setSearchedStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const cache = useRef<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const fetchStudents = useCallback(async () => {
    try {
      setIsLoading(true);
      const res: resp<Student[]> = await asyncGet(api.findAll);
      if (res.code === 200) {
        setStudents(res.body);
      } else {
        alert('獲取學生列表失敗');
      }
    } catch (error) {
      console.error('獲取學生列表錯誤:', error);
      alert('獲取學生列表時發生錯誤');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!cache.current) {
      cache.current = true;
      fetchStudents();
    }
  }, [fetchStudents]);

  const handleDelete = async () => {
    if (!formData.id) {
      alert('請輸入刪除的 ID');
      return;
    }

    try {
      setIsLoading(true);
      const response = await asyncDelete(`${api.delete}?id=${formData.id}`);
      if (response.code === 200) {
        alert('刪除成功');
        await fetchStudents();
        setFormData(prev => ({ ...prev, id: '' }));
      } else if (response.code === 404) {
        alert('找不到使用者');
      } else {
        alert('伺服器錯誤');
      }
    } catch (error) {
      alert('刪除出錯：' + error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInsert = async () => {
    const { account, name, department, grade, Class, Email } = formData;
    if (!account || !name || !department || !grade || !Class || !Email) {
      alert('請完整填寫所有欄位');
      return;
    }

    try {
      setIsLoading(true);
      const response = await asyncPost(api.insertOne, {
        userName: account,
        name,
        department,
        grade,
        class: Class,
        email: Email,
      });

      if (response.code === 200) {
        alert('新增成功');
        await fetchStudents();
        setFormData(prev => ({
          ...prev,
          account: '',
          name: '',
          department: '',
          grade: '',
          Class: '',
          Email: '',
        }));
      } else if (response.code === 403) {
        alert('重複的使用者帳號');
      } else {
        alert('伺服器錯誤');
      }
    } catch (error) {
      console.error('新增出錯：', error);
      alert('新增時發生錯誤');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!formData.findId || !formData.newName) {
      alert('請輸入完整的修改資料');
      return;
    }

    try {
      setIsLoading(true);
      const response = await asyncPut(api.update, {
        id: formData.findId,
        name: formData.newName,
      });

      if (response.code === 200) {
        alert('更新成功');
        await fetchStudents();
        setFormData(prev => ({
          ...prev,
          findId: '',
          newName: '',
        }));
      } else if (response.code === 404) {
        alert('找不到使用者');
      } else {
        alert('伺服器錯誤');
      }
    } catch (error) {
      console.error('更新出錯：', error);
      alert('更新時發生錯誤');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!formData.searchId) {
      alert('請輸入查詢的 ID');
      return;
    }

    try {
      setIsLoading(true);
      const response = await asyncGet(`${api.findAll}`);
      if (response.code === 200) {
        const foundStudent = response.body.find(
          (student: Student) => student._id === formData.searchId
        );
        if (foundStudent) {
          setSearchedStudent(foundStudent);
        } else {
          alert('找不到該學生');
          setSearchedStudent(null);
        }
      } else {
        alert('伺服器錯誤');
      }
    } catch (error) {
      console.error('查詢出錯：', error);
      alert('查詢時發生錯誤');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='container'>
      <div className='input-section'>
        <h2>新增學生</h2>
        <input
          type="text"
          name="account"
          placeholder="帳號"
          value={formData.account}
          onChange={handleInputChange}
          disabled={isLoading}
        />
        <input
          type="text"
          name="name"
          placeholder="姓名"
          value={formData.name}
          onChange={handleInputChange}
          disabled={isLoading}
        />
        <input
          type="text"
          name="department"
          placeholder="院系"
          value={formData.department}
          onChange={handleInputChange}
          disabled={isLoading}
        />
        <input
          type="text"
          name="grade"
          placeholder="年級"
          value={formData.grade}
          onChange={handleInputChange}
          disabled={isLoading}
        />
        <input
          type="text"
          name="Class"
          placeholder="班級"
          value={formData.Class}
          onChange={handleInputChange}
          disabled={isLoading}
        />
        <input
          type="email"
          name="Email"
          placeholder="Email"
          value={formData.Email}
          onChange={handleInputChange}
          disabled={isLoading}
        />
        <button onClick={handleInsert} disabled={isLoading}>
          {isLoading ? '處理中...' : '新增'}
        </button>

        <h2>修改學生</h2>
        <input
          type="text"
          name="findId"
          placeholder="修改ID"
          value={formData.findId}
          onChange={handleInputChange}
          disabled={isLoading}
        />
        <input
          type="text"
          name="newName"
          placeholder="新姓名"
          value={formData.newName}
          onChange={handleInputChange}
          disabled={isLoading}
        />
        <button onClick={handleUpdate} disabled={isLoading}>
          {isLoading ? '處理中...' : '修改'}
        </button>

        <h2>刪除學生</h2>
        <input
          type="text"
          name="id"
          placeholder="刪除ID"
          value={formData.id}
          onChange={handleInputChange}
          disabled={isLoading}
        />
        <button onClick={handleDelete} disabled={isLoading}>
          {isLoading ? '處理中...' : '刪除'}
        </button>

        <h2>查詢學生</h2>
        <input
          type="text"
          name="searchId"
          placeholder="查詢ID"
          value={formData.searchId}
          onChange={handleInputChange}
          disabled={isLoading}
        />
        <button onClick={handleSearch} disabled={isLoading}>
          {isLoading ? '處理中...' : '查詢'}
        </button>

        {searchedStudent && (
          <div className='search-result'>
            <h3>查詢結果</h3>
            <p>ID: {searchedStudent._id}</p>
            <p>帳號: {searchedStudent.userName}</p>
            <p>姓名: {searchedStudent.name}</p>
            <p>院系: {searchedStudent.department}</p>
            <p>年級: {searchedStudent.grade}</p>
            <p>班級: {searchedStudent.class}</p>
            <p>Email: {searchedStudent.email}</p>
          </div>
        )}
      </div>

      <h1>學生資料</h1>
      {isLoading ? (
        <div className="loading">載入中...</div>
      ) : (
        <div className='student-list'>
          {students.map((student: Student) => (
            <div className='student' key={student._id}>
              <p>ID: {student._id}</p>
              <p>帳號: {student.userName}</p>
              <p>姓名: {student.name}</p>
              <p>院系: {student.department}</p>
              <p>年級: {student.grade}</p>
              <p>班級: {student.class}</p>
              <p>Email: {student.email}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;