import React, {useState, useEffect} from 'react';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
export default function App() {
    const [files, setFiles] = useState([]) 
    const [options, setOptions] = useState([])
    const [isFilter, setIsFilter] = useState(true) 
    const [file, setFile] = useState('')

    const fetchData = async (file) => {
        try {
            if(file !== '') {
                console.log(file)
                const response = await axios.get(`http://localhost:8080/files/data?filename=${file}`);
                return response.data;
            } else {
                const response = await axios.get(`http://localhost:8080/files/data`);
                return response.data;
            }
        } catch (error) {
          console.error('Error fetching data:', error);
          throw error; // Re-lanzar el error para que pueda ser capturado por el catch de abajo
        }
      };
      const fetchOptions = async () => {
        try {
          const response = await axios.get('http://localhost:8080/files/list');
          return response.data;
        } catch (error) {
          console.error('Error fetching data:', error);
          throw error; // Re-lanzar el error para que pueda ser capturado por el catch de abajo
        }
      };
    
      useEffect(() => {
        const getData = async () => {
            try {
              const data = await fetchData(file);
              const options = await fetchOptions();
              console.log('Data received:', data); // Verifica la data antes de establecer el estado
              setFiles(prepareData(data));
              setOptions(options);
            } catch (error) {
              alert("Error fetching data");
              console.log(error);
            }
          };
      
          getData();
      }, [isFilter]);
    useEffect(() => {},[files, isFilter]);
    const prepareData = (data) => {
        const present = []
        console.log(data);
        for(const file of data) {
            for ( const line of file.lines) {
                const item = {
                    file: file.file,
                }
                for( const key in line) {
                    item[key] = line[key]
                }
                present.push(item);
            }
        }
        return present;
    }
    const handleFilter = (ev) => {
        setFile(ev.target.value)
        setIsFilter(!isFilter)
    }
    return (
        <>
            <Navbar bg="warning" data-bs-theme="light">
                <Container>
                    <Navbar.Brand href="#home">React app Test</Navbar.Brand>
                    <Form>
                        <Row>
                            <Col xs="auto">
                                <Form.Group controlId="exampleForm.SelectCustom">
                                    <Form.Label>Selecciona un file:</Form.Label>
                                    <Form.Select onChange={handleFilter}>
                                        <option value={''}>Todos</option>
                                        {options && options.map((opt,index) => {
                                            return (
                                                <option key={opt + index} value={opt}>{opt}</option>
                                            )
                                        }) 
                                        }
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Container>
            </Navbar>
            <Table>
                <thead>
                    <tr>
                        <th>FileName</th>
                        <th>Text</th>
                        <th>Number</th>
                        <th>Hex</th>
                    </tr>
                </thead>
                <tbody>
                    {files && files.length > 0 ? files.map((file, index) => {
                        return (
                    <tr key={file.file + index}>
                        <td>{file.file}</td>
                        <td>{file.text}</td>
                        <td>{file.number}</td>
                        <td>{file.hex}</td>
                    </tr>
                        )
                    })
                    : 
                    <tr>
                    <td>No data</td>
                    <td>No data</td>
                    <td>No data</td>
                    <td>No data</td>
                    </tr>
                    }
                </tbody>

            </Table>
    </>
    );
}