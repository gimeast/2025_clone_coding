package gimeast.restfulapiex1.common.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PageRequestDTO {
    @Builder.Default
    @Min(1)
    private int page = 1;

    @Builder.Default
    @Min(10)
    @Max(100)
    private int size = 10;

    public Pageable getPageable(Sort sort) {
        int pageNum = this.page - 1;
        return PageRequest.of(pageNum, this.size, sort);
    }
}
