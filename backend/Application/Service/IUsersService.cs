using ittask4.Application.Dto;
using ittask4.Application.ServiceResults;

namespace ittask4.Application.Service
{
    public interface IUsersService
    {
        Task<ServiceResult<UserRegisterResponseDto>> RegisterUser(UserRegisterRequestDto dto);
        Task<ServiceResult<UserLoginResponseDto>> LoginUser(UserLoginRequestDto dto);
    }
}


