import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchStaffComponent } from './search-staff.component';
import { MockStaffService } from '../mock-staff.service';
import { StaffService } from '../../../services/staff.service';
import { of, throwError }from 'rxjs';
import { ActivatedRoute } from '@angular/router';

describe('SearchStaffComponent', () => {
  let component: SearchStaffComponent;
  let fixture: ComponentFixture<SearchStaffComponent>;
  let mockStaffService: MockStaffService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchStaffComponent],
      providers: [
        { provide: StaffService, useClass: MockStaffService }, // Usando o mock
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: 'some-id' }), // Simula parâmetros de rota, se necessário
            queryParams: of({ search: 'query' }) // Simula query params, se necessário
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchStaffComponent);
    component = fixture.componentInstance;
    mockStaffService = TestBed.inject(StaffService) as unknown as MockStaffService; // Injetando o mock
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return staff when search is successful', () => {
    // Configurar o mock com uma lista de staff simulada
    const mockStaffList = [
      {
        id: 'D2000000001',
        fullName: 'Ana Maria',
        licenseNumber: '12345',
        email: 'ana@gmail.com',
        phoneNumber: '+234 5467394700',
        recruitmentYear: 2000,
        category: 'Doctor',
        specialization: 'Orthopedics',
      },
    ];

    // Inicializar campos de pesquisa no componente
    component.name = 'Ana';
    component.email = 'ana@gmail.com';

    // Chamar a função de pesquisa
    component.searchStaffs();
    fixture.detectChanges();

    // Verificar o estado após a chamada
    expect(component.staffList).toEqual(mockStaffList); // Verifica se a lista está correta
    expect(component.error).toBe(''); // O erro deve ser uma string vazia (respeitando clearMessages)
    expect(component.isLoading).toBeFalse(); // Verifica se o carregamento terminou
  });


  it('should set error message when no staff is found', () => {
    // Chamar a função de pesquisa com um valor qualquer
    component.name = 'John';
    component.searchStaffs();

    fixture.detectChanges();

    // Verificar se a lista de funcionários é vazia e se a mensagem de erro foi definida
    expect(component.staffList).toEqual([]);
    expect(component.error).toBe('No staff found!');
  });

  it('should handle errors when staff search fails', () => {
    // Configurar o mock para simular uma falha
    mockStaffService.filterStaffs.and.returnValue(
      throwError(() => ({ status: 500 })) // Simula erro de conexão (status 500)
    );

    // Configurar os campos de pesquisa no componente
    component.name = 'Nonexistent Staff';

    // Chamar o método de busca
    component.searchStaffs();
    fixture.detectChanges();

    // Verificar o estado após a falha
    expect(component.error).toBe('Error geting Staff profile. Connection failed!'); // Mensagem de erro
    expect(component.isLoading).toBeFalse(); // Verificar se o carregamento terminou
    expect(component.staffList).toEqual([]); // Lista deve permanecer vazia
  });


  it('should load staffs on init', () => {
    // Simular o retorno do mock para o método getStaffs
    mockStaffService.getStaffs.and.returnValue(
      of({
        body: [
          {
            id: 'D2000000001',
            fullName: 'Ana Maria',
            licenseNumber: '12345',
            email: 'ana@gmail.com',
            phoneNumber: '+234 5467394700',
            recruitmentYear: 2000,
            category: 'Doctor',
            specialization: 'Orthopedics',
          },
        ],
        headers: new Map<string, string>(),
        status: 200,
      })
    );

    // Chamar o ngOnInit do componente
    component.ngOnInit();

    // Garantir que o serviço foi chamado
    expect(mockStaffService.getStaffs).toHaveBeenCalled();

    // Verificar se os staffs foram carregados corretamente
    expect(component.staffList.length).toBe(1); // O mock tem 1 staff
    expect(component.staffList[0].fullName).toBe('Ana Maria'); // Verifica um dado específico

    // Garantir que o indicador de carregamento foi desativado
    expect(component.isLoading).toBeFalse();
  });

  it('should show error message if no staffs are found on init', () => {
    mockStaffService.getStaffs.and.returnValue(
      of({ body: [], headers: new Map<string, string>(), status: 200 }) // Retorna lista vazia
    );

    component.ngOnInit();

    expect(mockStaffService.getStaffs).toHaveBeenCalled();
    expect(component.staffList.length).toBe(0);
    expect(component.error).toBe('No staff found!');
    expect(component.isLoading).toBeFalse();
  });

  it('should deactivate a staff and update the list on success', () => {
    const staffToDeactivate = {
      id: 'D2000000001',
      fullName: 'Ana Maria',
      licenseNumber: '12345',
      email: 'ana@gmail.com',
      phoneNumber: '+234 5467394700',
      recruitmentYear: 2000,
      category: 'Doctor',
      specialization: 'Orthopedics'
    };

    // Simula a confirmação do usuário
    spyOn(window, 'confirm').and.returnValue(true);

    // Simula o sucesso no serviço de desativação
    mockStaffService.deactivateStaff.and.returnValue(of({ message: 'Staff deactivated successfully' }));

    // Limpa mensagens de sucesso e erro antes de simular a desativação
    component.clearMessages();

    // Chama o método de desativação
    component.deactivateStaff(staffToDeactivate);

    // Verifica se o método de desativação foi chamado com o ID correto
    expect(mockStaffService.deactivateStaff).toHaveBeenCalledWith(staffToDeactivate.id);

    // Verifica se a mensagem de sucesso foi definida corretamente
    expect(component.success).toBe('Staff deactivated successfully');

    // Verifica se a lista de staffs foi atualizada corretamente
    component.getStaffs();
    expect(component.staffList.length).toBe(0); // A lista deve estar vazia após a remoção do staff
  });

  it('should handle server error when deactivating a staff', () => {
    const staffToDeactivate = {
      id: 'D2000000001',
      fullName: 'Ana Maria',
      licenseNumber: '12345',
      email: 'ana@gmail.com',
      phoneNumber: '+234 5467394700',
      recruitmentYear: 2000,
      category: 'Doctor',
      specialization: 'Orthopedics'
    };

    // Simula a confirmação do usuário
    spyOn(window, 'confirm').and.returnValue(true);

    // Simula o erro 500 no serviço de desativação
    mockStaffService.deactivateStaff.and.returnValue(throwError(() => ({ status: 500, message: 'Server error' })));

    // Limpa as mensagens de sucesso e erro antes de simular o erro
    component.clearMessages();

    // Chama o método de desativação
    component.deactivateStaff(staffToDeactivate);

    // Verifica se a mensagem de erro foi definida corretamente
    expect(component.error).toBe('Error deactivating Staff profile. Connection failed!');

    // Verifica se o estado de loading foi alterado corretamente
    expect(component.isLoading).toBeFalse();

    // Verifica se a lista de staffs não foi alterada
    expect(component.staffList.length).toBe(0); // A lista deve continuar com 1 staff
  });



});

